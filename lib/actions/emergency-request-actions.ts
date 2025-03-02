// lib/actions/emergency-request-actions.ts
"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/request";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * Creates an emergency blood request with extended information
 * This extends the existing request schema with emergency-specific fields
 */
export async function createEmergencyRequest(data: {
  patientName: string;
  bloodType: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  hospital: string;
  location: { lat: number; lng: number };
  emergencyDetails: {
    quantity: number;
    hospitalAddress: string;
    city: string;
    state: string;
    zipCode: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    patientCondition: string;
    additionalNotes: string;
  };
}) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Create the emergency request with additional fields
    const newRequest = new BloodRequest({
      patientName: data.patientName,
      bloodType: data.bloodType,
      urgencyLevel: data.urgencyLevel,
      hospital: data.hospital,
      location: data.location,
      userId: new mongoose.Types.ObjectId(session.userId),
      requestDate: new Date(),
      status: "pending",
      isEmergency: true, // Flag to identify emergency requests
      emergencyDetails: data.emergencyDetails, // Store additional emergency-specific data
    });

    await newRequest.save();

    return { success: true, data: JSON.parse(JSON.stringify(newRequest)) };
  } catch (error) {
    console.error("Create emergency blood request error:", error);
    return {
      success: false,
      error: "Failed to create emergency blood request",
    };
  }
}

/**
 * Gets all emergency requests
 */
export async function getEmergencyRequests() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Get all emergency requests (excluding user's own)
    const requests = await BloodRequest.find({
      userId: { $ne: new mongoose.Types.ObjectId(session.userId) },
      status: "pending",
      isEmergency: true,
    }).sort({ requestDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(requests)) };
  } catch (error) {
    console.error("Get emergency requests error:", error);
    return { success: false, error: "Failed to get emergency requests" };
  }
}

/**
 * Gets user's emergency requests
 */
export async function getUserEmergencyRequests() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Get all emergency requests made by the user
    const requests = await BloodRequest.find({
      userId: new mongoose.Types.ObjectId(session.userId),
      isEmergency: true,
    }).sort({ requestDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(requests)) };
  } catch (error) {
    console.error("Get user emergency requests error:", error);
    return { success: false, error: "Failed to get user emergency requests" };
  }
}
