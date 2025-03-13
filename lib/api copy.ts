import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { database } from "./firebase"
import type { BloodRequest, Campaign } from "./types"
import { getDistance } from "./utils"

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { ref, set } from "firebase/database";

// Define the QualificationQuestion type
interface QualificationQuestion {
  id: string
  text: string
  order: number
}

// Blood Requests
export async function getBloodRequests(userLocation: { lat: number; lng: number }) {
  try {
    // In a real app, you would use Firestore's geoqueries
    // For simplicity, we'll fetch all and calculate distance client-side
    const q = query(
      collection(db, "bloodRequests"),
      where("status", "in", ["pending", "accepted"]),
      orderBy("createdAt", "desc"),
    )

    const querySnapshot = await getDocs(q)
    const requests: BloodRequest[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<BloodRequest, "id" | "distance">
      const request = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        distance: getDistance(userLocation.lat, userLocation.lng, data.location.lat, data.location.lng),
      }
      requests.push(request)
    })

    // Sort by distance
    return requests.sort((a, b) => (a.distance || 0) - (b.distance || 0))
  } catch (error) {
    console.error("Error fetching blood requests:", error)
    throw error
  }
}

export async function getBloodRequestById(requestId: string) {
  try {
    const docRef = doc(db, "bloodRequests", requestId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as BloodRequest
    } else {
      throw new Error("Blood request not found")
    }
  } catch (error) {
    console.error("Error fetching blood request:", error)
    throw error
  }
}

export async function updateBloodRequestStatus(requestId: string, status: string, donorId: string) {
  try {
    const docRef = doc(db, "bloodRequests", requestId)
    await updateDoc(docRef, {
      status: status,
      donorId: donorId,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating blood request:", error)
    throw error
  }
}

// Campaigns
export async function getCampaigns(userLocation: { lat: number; lng: number }) {
  try {
    const q = query(
      collection(db, "campaigns"),
      where("date", ">=", new Date().toISOString().split("T")[0]),
      orderBy("date", "asc"),
    )

    const querySnapshot = await getDocs(q)
    const campaigns: Campaign[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Campaign, "id" | "distance">
      const campaign = {
        id: doc.id,
        ...data,
        distance: data.coordinates
          ? getDistance(userLocation.lat, userLocation.lng, data.coordinates.lat, data.coordinates.lng)
          : undefined,
      }
      campaigns.push(campaign)
    })

    // Sort by date and then by distance
    return campaigns.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      if (dateA === dateB) {
        return (a.distance || 0) - (b.distance || 0)
      }
      return dateA - dateB
    })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    throw error
  }
}

export async function registerForCampaign(campaignId: string, userId: string) {
  try {
    const docRef = await addDoc(collection(db, "campaignRegistrations"), {
      campaignId,
      userId,
      status: "registered",
      createdAt: serverTimestamp(),
    })

    // Update campaign registered donors count
    const campaignRef = doc(db, "campaigns", campaignId)
    await updateDoc(campaignRef, {
      registeredDonors: increment(1),
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error registering for campaign:", error)
    throw error
  }
}

// Donor Qualification
export async function createDonorQualification(requestId: string, donorId: string) {
  try {
    const docRef = await addDoc(collection(db, "donorQualifications"), {
      requestId,
      donorId,
      status: "pending",
      responses: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error creating donor qualification:", error)
    throw error
  }
}

export async function updateDonorQualification(
  qualificationId: string,
  responses: any,
  status: "pending" | "qualified" | "disqualified",
) {
  try {
    const docRef = doc(db, "donorQualifications", qualificationId)
    await updateDoc(docRef, {
      responses,
      status,
      updatedAt: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating donor qualification:", error)
    throw error
  }
}

export async function getQualificationQuestions() {
  try {
    const q = query(collection(db, "qualificationQuestions"), orderBy("order", "asc"))
    const querySnapshot = await getDocs(q)
    const questions: QualificationQuestion[] = []

    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() } as QualificationQuestion)
    })

    return questions
  } catch (error) {
    console.error("Error fetching qualification questions:", error)
    throw error
  }
}

// Helper function for incrementing values in Firestore
function increment(amount: number) {
  return {
    // This is a placeholder for Firebase's FieldValue.increment
    // In a real app, you would use:
    // firebase.firestore.FieldValue.increment(amount)
    __increment: amount,
  }
}




// ================  Register =================
export async function registerUser(
  email: string,
  password: string,
  name: string,
  bloodType: string,
  phoneNumber: string,
  location: { lat: number; lng: number; address: string },
  isDonor: boolean,
  lastDonationDate?: string
) {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // Update the user profile with name
    await updateProfile(userCredential.user, {
      displayName: name
    });

    const now = new Date().toISOString();
    
    // Prepare user data for Realtime Database
    const userData: User = {
      id: userCredential.user.uid,
      name,
      email,
      bloodType,
      phoneNumber,
      location,
      isDonor,
      lastDonationDate,
      createdAt: now,
      updatedAt: now
    };

    // Save user data to Realtime Database
    // Note the different syntax compared to Firestore
    await set(ref(database, `users/${userCredential.user.uid}`), userData);

    return {
      success: true,
      user: userData
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Function to check if user can donate blood (based on last donation date)
export function canDonate(lastDonationDate: string | undefined): boolean {
  if (!lastDonationDate) return true;
  
  // Men can donate every 3 months, women every 4 months
  // Since we don't have gender info, we'll use the conservative 4 months
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
  
  const lastDonation = new Date(lastDonationDate);
  return lastDonation <= fourMonthsAgo;
}