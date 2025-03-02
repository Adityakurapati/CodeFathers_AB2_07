// lib/models/donation.ts
import mongoose, { type Model, Schema } from "mongoose";

// Define the interface for Donation document
interface IDonation {
  recipient: string;
  bloodType: string;
  hospital: string;
  donationDate: Date;
  status: "scheduled" | "completed" | "cancelled";
  userId: mongoose.Schema.Types.ObjectId;
  requestId: mongoose.Schema.Types.ObjectId;
}

// Define the Donation Schema
const DonationSchema = new Schema<IDonation>({
  recipient: {
    type: String,
    required: [true, "Please provide a recipient name"],
  },
  bloodType: {
    type: String,
    required: [true, "Please provide a blood type"],
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  hospital: {
    type: String,
    required: [true, "Please provide a hospital name"],
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodRequest",
    required: true,
  },
});

// Check if the model exists, if not create it
const Donation =
  (mongoose.models.Donation as Model<IDonation>) ||
  mongoose.model<IDonation>("Donation", DonationSchema);

export { Donation };
export type { IDonation };
