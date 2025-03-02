// lib/models/request.ts
import mongoose, { type Model, Schema } from "mongoose";

// Define the interface for Blood Request document
interface IBloodRequest {
  patientName: string;
  bloodType: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  hospital: string;
  location: {
    lat: number;
    lng: number;
  };
  distance?: string;
  requestDate: Date;
  status: "pending" | "matched" | "fulfilled" | "cancelled";
  userId: mongoose.Schema.Types.ObjectId;
  recipientId: mongoose.Schema.Types.ObjectId;
}

// Define the Blood Request Schema
const BloodRequestSchema = new Schema<IBloodRequest>({
  patientName: {
    type: String,
    required: [true, "Please provide a patient name"],
    maxlength: [100, "Patient name cannot be more than 100 characters"],
  },
  bloodType: {
    type: String,
    required: [true, "Please provide a blood type"],
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  urgencyLevel: {
    type: String,
    required: [true, "Please provide an urgency level"],
    enum: ["low", "medium", "high", "critical"],
  },
  hospital: {
    type: String,
    required: [true, "Please provide a hospital name"],
  },
  location: {
    lat: Number,
    lng: Number,
  },
  distance: String,
  requestDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "matched", "fulfilled", "cancelled"],
    default: "pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Check if the model exists, if not create it
const BloodRequest =
  (mongoose.models.BloodRequest as Model<IBloodRequest>) ||
  mongoose.model<IBloodRequest>("BloodRequest", BloodRequestSchema);

export { BloodRequest };
export type { IBloodRequest };
