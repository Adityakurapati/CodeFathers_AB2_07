import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  ref,
  set,
  get,
  push, 
  update,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { auth, database } from "./firebase"; // Make sure this is correctly importing database
import type { BloodRequest, Campaign } from "./types";
import { getDistance } from "./utils";

// Define User type
interface User {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  phoneNumber: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  isDonor: boolean;
  lastDonationDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Define the QualificationQuestion type
interface QualificationQuestion {
  id: string;
  text: string;
  order: number;
}

// User Registration
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

// Blood Requests
export async function getBloodRequests(userLocation: { lat: number; lng: number }) {
  try {
    // Get all blood requests with status 'pending' or 'accepted'
    const bloodRequestsRef = ref(database, 'bloodRequests');
    const snapshot = await get(bloodRequestsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const requests: BloodRequest[] = [];
    
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      
      // Only include pending or accepted requests
      if (data.status === 'pending' || data.status === 'accepted') {
        const request = {
          id: childSnapshot.key,
          ...data,
          createdAt: data.createdAt || new Date().toISOString(),
          distance: getDistance(userLocation.lat, userLocation.lng, data.location.lat, data.location.lng),
        };
        requests.push(request);
      }
    });
    
    // Sort by distance and then by creation date (newest first)
    return requests
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    throw error;
  }
}

export async function getBloodRequestById(requestId: string) {
  try {
    const requestRef = ref(database, `bloodRequests/${requestId}`);
    const snapshot = await get(requestRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() } as BloodRequest;
    } else {
      throw new Error("Blood request not found");
    }
  } catch (error) {
    console.error("Error fetching blood request:", error);
    throw error;
  }
}

export async function updateBloodRequestStatus(requestId: string, status: string, donorId: string) {
  try {
    const requestRef = ref(database, `bloodRequests/${requestId}`);
    
    await update(requestRef, {
      status: status,
      donorId: donorId,
      updatedAt: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating blood request:", error);
    throw error;
  }
}

// Campaigns
export async function getCampaigns(userLocation: { lat: number; lng: number }) {
  try {
    const campaignsRef = ref(database, 'campaigns');
    const snapshot = await get(campaignsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const today = new Date().toISOString().split('T')[0];
    const campaigns: Campaign[] = [];
    
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      
      // Only include campaigns that haven't happened yet
      if (data.date >= today) {
        const campaign = {
          id: childSnapshot.key,
          ...data,
          distance: data.coordinates
            ? getDistance(userLocation.lat, userLocation.lng, data.coordinates.lat, data.coordinates.lng)
            : undefined,
        };
        campaigns.push(campaign);
      }
    });
    
    // Sort by date and then by distance
    return campaigns.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA === dateB) {
        return (a.distance || 0) - (b.distance || 0);
      }
      return dateA - dateB;
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
}

export async function registerForCampaign(campaignId: string, userId: string) {
  try {
    // Add registration
    const registrationsRef = ref(database, 'campaignRegistrations');
    const newRegistrationRef = push(registrationsRef);
    
    await set(newRegistrationRef, {
      campaignId,
      userId,
      status: "registered",
      createdAt: new Date().toISOString(),
    });
    
    // Increment registered donors count
    const campaignRef = ref(database, `campaigns/${campaignId}`);
    const campaignSnapshot = await get(campaignRef);
    
    if (campaignSnapshot.exists()) {
      const campaignData = campaignSnapshot.val();
      const currentCount = campaignData.registeredDonors || 0;
      
      await update(campaignRef, {
        registeredDonors: currentCount + 1,
      });
    }
    
    return { success: true, id: newRegistrationRef.key };
  } catch (error) {
    console.error("Error registering for campaign:", error);
    throw error;
  }
}

// Donor Qualification
export async function createDonorQualification(requestId: string, donorId: string) {
  try {
    const qualificationsRef = ref(database, 'donorQualifications');
    const newQualificationRef = push(qualificationsRef);
    
    const now = new Date().toISOString();
    
    await set(newQualificationRef, {
      requestId,
      donorId,
      status: "pending",
      responses: {},
      createdAt: now,
      updatedAt: now,
    });
    
    return { success: true, id: newQualificationRef.key };
  } catch (error) {
    console.error("Error creating donor qualification:", error);
    throw error;
  }
}

export async function updateDonorQualification(
  qualificationId: string,
  responses: any,
  status: "pending" | "qualified" | "disqualified"
) {
  try {
    const qualificationRef = ref(database, `donorQualifications/${qualificationId}`);
    
    await update(qualificationRef, {
      responses,
      status,
      updatedAt: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating donor qualification:", error);
    throw error;
  }
}

export async function getQualificationQuestions() {
  try {
    const questionsRef = ref(database, 'qualificationQuestions');
    const snapshot = await get(questionsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const questions: QualificationQuestion[] = [];
    
    snapshot.forEach((childSnapshot) => {
      questions.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      } as QualificationQuestion);
    });
    
    // Sort by order
    return questions.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching qualification questions:", error);
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