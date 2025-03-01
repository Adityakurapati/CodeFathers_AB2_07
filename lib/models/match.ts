// lib/models/match.ts
import mongoose, { type Model, Schema } from "mongoose";

// Define the interface for Match document
interface IMatch {
  requestId: mongoose.Schema.Types.ObjectId;
  donorId: mongoose.Schema.Types.ObjectId;
  matchDate: Date;
  status: "matched" | "accepted" | "declined" | "completed";
}

// Define the Match Schema
const MatchSchema = new Schema<IMatch>({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodRequest",
    required: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  matchDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["matched", "accepted", "declined", "completed"],
    default: "matched",
  },
});

// Check if the model exists, if not create it
const Match =
  (mongoose.models.Match as Model<IMatch>) ||
  mongoose.model<IMatch>("Match", MatchSchema);

export { Match };
export type { IMatch };
