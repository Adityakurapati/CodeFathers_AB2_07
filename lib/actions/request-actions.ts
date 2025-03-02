// lib/actions/request-actions.ts
"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/request";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function getAvailableRequests() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Get all available requests (excluding user's own)
    const requests = await BloodRequest.find({
      userId: { $ne: new mongoose.Types.ObjectId(session.userId) },
      status: "pending",
    }).sort({ requestDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(requests)) };
  } catch (error) {
    console.error("Get available requests error:", error);
    return { success: false, error: "Failed to get available requests" };
  }
}

export async function getUserRequests() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Get all requests made by the user
    const requests = await BloodRequest.find({
      userId: new mongoose.Types.ObjectId(session.userId),
    }).sort({ requestDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(requests)) };
  } catch (error) {
    console.error("Get user requests error:", error);
    return { success: false, error: "Failed to get user requests" };
  }
}

export async function createBloodRequest(data: {
  patientName: string;
  bloodType: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  hospital: string;
  location: { lat: number; lng: number };
}) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    const newRequest = new BloodRequest({
      ...data,
      userId: new mongoose.Types.ObjectId(session.userId),
      requestDate: new Date(),
      status: "pending",
    });

    await newRequest.save();

    return { success: true, data: JSON.parse(JSON.stringify(newRequest)) };
  } catch (error) {
    console.error("Create blood request error:", error);
    return { success: false, error: "Failed to create blood request" };
  }
}

export async function updateRequestStatus(requestId: string, status: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    const request = await BloodRequest.findById(requestId);
    if (!request) {
      return { success: false, error: "Request not found" };
    }

    // Only allow updating your own requests
    if (request.userId.toString() !== session.userId) {
      return { success: false, error: "Not authorized to update this request" };
    }

    request.status = status as any;
    await request.save();

    return { success: true };
  } catch (error) {
    console.error("Update request status error:", error);
    return { success: false, error: "Failed to update request status" };
  }
}
