import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/lib/models/user";
import { connectToDatabase } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Define the session interface for TypeScript
interface Session {
  userId: string;
  email: string;
  name: string;
  bloodType: string;
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get("auth_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      name: string;
      bloodType: string;
    };

    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      bloodType: decoded.bloodType,
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Get user profile error:", error);
    return null;
  }
}
