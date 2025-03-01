import { cookies } from "next/headers";
import { jwtVerify, importSPKI } from "jose"; // Use jose instead of jsonwebtoken
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
    // Convert JWT_SECRET to Uint8Array for jose
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    // Verify the token using jose
    const { payload } = await jwtVerify(token, secretKey);

    // The payload has the JWT claims
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      bloodType: payload.bloodType as string,
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
