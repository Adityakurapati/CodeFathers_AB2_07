// lib/actions/match-actions.ts
"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Match } from "@/lib/models/match";
import { BloodRequest } from "@/lib/models/request";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function getMatches() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Get all matches for the user as donor
    const matches = await Match.find({
      donorId: new mongoose.Types.ObjectId(session.userId),
    }).sort({ matchDate: -1 });

    // Get the full request details for each match
    const matchesWithDetails = await Promise.all(
      matches.map(async (match) => {
        const request = await BloodRequest.findById(match.requestId);
        return {
          ...match.toObject(),
          request: request ? request.toObject() : null,
        };
      })
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(matchesWithDetails)),
    };
  } catch (error) {
    console.error("Get matches error:", error);
    return { success: false, error: "Failed to get matches" };
  }
}

export async function createMatch(requestId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    // Check if the request exists
    const request = await BloodRequest.findById(requestId);
    if (!request) {
      return { success: false, error: "Blood request not found" };
    }

    // Check if there's already a match for this request and donor
    const existingMatch = await Match.findOne({
      requestId: new mongoose.Types.ObjectId(requestId),
      donorId: new mongoose.Types.ObjectId(session.userId),
    });

    if (existingMatch) {
      return {
        success: false,
        error: "You've already matched with this request",
      };
    }

    // Create a new match
    const newMatch = new Match({
      requestId: new mongoose.Types.ObjectId(requestId),
      donorId: new mongoose.Types.ObjectId(session.userId),
      matchDate: new Date(),
      status: "matched",
    });

    await newMatch.save();

    // Update the request status
    request.status = "matched";
    await request.save();

    return { success: true, data: JSON.parse(JSON.stringify(newMatch)) };
  } catch (error) {
    console.error("Create match error:", error);
    return { success: false, error: "Failed to create match" };
  }
}

export async function updateMatchStatus(matchId: string, status: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();

    const match = await Match.findById(matchId);
    if (!match) {
      return { success: false, error: "Match not found" };
    }

    // Only allow updating if you're the donor
    if (match.donorId.toString() !== session.userId) {
      return { success: false, error: "Not authorized to update this match" };
    }

    match.status = status as any;
    await match.save();

    // If accepted, create a donation
    if (status === "accepted") {
      // Logic to create a donation would go here
      // This could be a call to the createDonation function
    }

    // If declined, update the request status back to pending
    if (status === "declined") {
      const request = await BloodRequest.findById(match.requestId);
      if (request) {
        request.status = "pending";
        await request.save();
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Update match status error:", error);
    return { success: false, error: "Failed to update match status" };
  }
}
