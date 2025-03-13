import { database } from "./firebase";
import { ref, get, set, push, update, remove, query, orderByChild, equalTo } from "firebase/database";

// Types
export interface Location {
  lat: number;
  lng: number;
}

export interface BloodRequest {
  id?: string;
  address: string;
  bloodType: string;
  contactNumber: string;
  createdAt: string;
  donorId?: string;
  fullName: string;
  hospitalName: string;
  location: Location;
  reason: string;
  requesterId: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  updatedAt: string;
  urgencyLevel: "immediate" | "within12Hours" | "within24Hours" | "within48Hours";
}

// Helper to get urgency level text for UI display
export function getUrgencyLevelLabel(urgencyLevel: string): string {
  switch (urgencyLevel) {
    case "immediate":
      return "Critical";
    case "within12Hours":
      return "High";
    case "within24Hours":
      return "Medium";
    case "within48Hours":
      return "Low";
    default:
      return "Unknown";
  }
}

// Helper to get urgency value from UI labels
export function getUrgencyValue(urgencyLabel: string): string {
  switch (urgencyLabel) {
    case "Critical":
      return "critical";
    case "High":
      return "high";
    case "Medium":
      return "medium";
    case "Low":
      return "low";
    default:
      return urgencyLabel.toLowerCase();
  }
}

// Helper to generate a timestamp
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Get all blood requests
export async function getAllBloodRequests(): Promise<BloodRequest[]> {
  const bloodRequestsRef = ref(database, "bloodRequests");
  const snapshot = await get(bloodRequestsRef);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  const requests: BloodRequest[] = [];
  const data = snapshot.val();
  
  for (const key in data) {
    requests.push({
      id: key,
      ...data[key]
    });
  }
  
  return requests;
}

// Get a specific blood request by ID
export async function getBloodRequestById(id: string): Promise<BloodRequest | null> {
  const requestRef = ref(database, `bloodRequests/${id}`);
  const snapshot = await get(requestRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id,
    ...snapshot.val()
  };
}

// Get blood requests for the current user
export async function getCurrentUserBloodRequests(userId: string): Promise<BloodRequest[]> {
  const bloodRequestsRef = ref(database, "bloodRequests");
  const userRequestsQuery = query(bloodRequestsRef, orderByChild("requesterId"), equalTo(userId));
  const snapshot = await get(userRequestsQuery);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  const requests: BloodRequest[] = [];
  const data = snapshot.val();
  
  for (const key in data) {
    requests.push({
      id: key,
      ...data[key]
    });
  }
  
  // Sort by creation date, newest first
  return requests.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// Create a new blood request
export async function createBloodRequest(requestData: Omit<BloodRequest, "id" | "createdAt" | "updatedAt">): Promise<BloodRequest> {
  const bloodRequestsRef = ref(database, "bloodRequests");
  const newRequestRef = push(bloodRequestsRef);
  
  const timestamp = getCurrentTimestamp();
  const newRequest: Omit<BloodRequest, "id"> = {
    ...requestData,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  await set(newRequestRef, newRequest);
  
  return {
    id: newRequestRef.key as string,
    ...newRequest
  };
}

// Update an existing blood request
export async function updateBloodRequest(id: string, updates: Partial<BloodRequest>): Promise<BloodRequest> {
  const requestRef = ref(database, `bloodRequests/${id}`);
  
  // Get current data first
  const snapshot = await get(requestRef);
  if (!snapshot.exists()) {
    throw new Error(`Blood request with ID ${id} not found`);
  }
  
  const currentData = snapshot.val();
  const updatedRequest = {
    ...currentData,
    ...updates,
    updatedAt: getCurrentTimestamp()
  };
  
  await update(requestRef, updatedRequest);
  
  return {
    id,
    ...updatedRequest
  };
}

// Delete a blood request
export async function deleteBloodRequest(id: string): Promise<void> {
  const requestRef = ref(database, `bloodRequests/${id}`);
  await remove(requestRef);
}

// Accept a blood request (for donor use)
export async function acceptBloodRequest(requestId: string, donorId: string): Promise<BloodRequest> {
  return updateBloodRequest(requestId, {
    status: "accepted",
    donorId,
    updatedAt: getCurrentTimestamp()
  });
}

// Mark a blood request as completed
export async function completeBloodRequest(requestId: string): Promise<BloodRequest> {
  return updateBloodRequest(requestId, {
    status: "completed",
    updatedAt: getCurrentTimestamp()
  });
}

// Cancel a blood request
export async function cancelBloodRequest(requestId: string): Promise<BloodRequest> {
  return updateBloodRequest(requestId, {
    status: "cancelled",
    updatedAt: getCurrentTimestamp()
  });
}

// For demo/testing - uses a hardcoded user ID from the schema
export function getHardcodedUserId(): string {
  // This is the ID of the user from your schema
  return "KH3hXtdgk6exwpaiSfaC5hEUU8u1";
}

// Get dummy location data for new requests
export function getDummyLocation(): Location {
  // Using Pune locations from your database examples
  const locations = [
    { lat: 18.5308, lng: 73.8475 }, // Ruby Hall Clinic
    { lat: 18.5193, lng: 73.8567 }, // Jehangir Hospital
    { lat: 18.621, lng: 73.7868 },  // Aditya Birla Memorial Hospital
    { lat: 18.5073, lng: 73.8289 }, // Sahyadri Hospital
    { lat: 18.5233, lng: 73.8717 }  // KEM Hospital
  ];
  
  const randomIndex = Math.floor(Math.random() * locations.length);
  return locations[randomIndex];
}