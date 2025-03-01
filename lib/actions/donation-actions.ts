// lib/actions/donation-actions.ts
"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Donation } from "@/lib/models/donation";
import { BloodRequest } from "@/lib/models/request";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function getDonationHistory() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Get all donations made by the user
    const donations = await Donation.find({
      userId: new mongoose.Types.ObjectId(session.userId),
    }).sort({ donationDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(donations)) };
  } catch (error) {
    console.error("Get donation history error:", error);
    return { success: false, error: "Failed to get donation history" };
  }
}

export async function createDonation(data: {
  requestId: string;
  recipient: string;
  hospital: string;
}) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Find the request
    const request = await BloodRequest.findById(data.requestId);
    if (!request) {
      return { success: false, error: "Blood request not found" };
    }

    const newDonation = new Donation({
      recipient: data.recipient,
      bloodType: request.bloodType,
      hospital: data.hospital,
      donationDate: new Date(),
      status: "scheduled",
      userId: new mongoose.Types.ObjectId(session.userId),
      requestId: new mongoose.Types.ObjectId(data.requestId),
    });

    await newDonation.save();

    // Update the request status
    request.status = "matched";
    await request.save();

    return { success: true, data: JSON.parse(JSON.stringify(newDonation)) };
  } catch (error) {
    console.error("Create donation error:", error);
    return { success: false, error: "Failed to create donation" };
  }
}

export async function updateDonationStatus(donationId: string, status: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return { success: false, error: "Donation not found" };
    }

    // Only allow updating your own donations
    if (donation.userId.toString() !== session.userId) {
      return {
        success: false,
        error: "Not authorized to update this donation",
      };
    }

    donation.status = status as any;
    await donation.save();

    // If donation is completed, update the user's donation count
    if (status === "completed") {
      // Find the associated request and mark as fulfilled
      const request = await BloodRequest.findById(donation.requestId);
      if (request) {
        request.status = "fulfilled";
        await request.save();
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Update donation status error:", error);
    return { success: false, error: "Failed to update donation status" };
  }
}
