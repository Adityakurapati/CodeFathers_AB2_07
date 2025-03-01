import mongoose from "mongoose";

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password should be at least 8 characters"],
  },
  bloodType: {
    type: String,
    required: [true, "Please provide a blood type"],
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  lastDonation: {
    type: Date,
    default: null,
  },
  donationCount: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  location: {
    type: {
      city: String,
      state: String,
      country: String,
    },
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model exists, if not create it
// This is the key fix - use a safer way to check for an existing model
let User;
try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", UserSchema);
}

export { User };
