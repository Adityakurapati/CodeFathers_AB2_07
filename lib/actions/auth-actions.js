"use server";

import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/user";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; // Use jose instead of jsonwebtoken

const JWT_SECRET=process.env.JWT_SECRET;

if ( !JWT_SECRET )
{
        throw new Error( "JWT_SECRET is not defined in environment variables" );
}

export async function registerUser ( userData )
{
        try
        {
                // Connect to database first
                await connectToDatabase();

                // Check if user already exists
                const existingUser=await User.findOne( { email: userData.email } );
                if ( existingUser )
                {
                        return { success: false, error: "Email already in use" };
                }

                // Hash the password
                const hashedPassword=await bcrypt.hash( userData.password, 10 );

                // Create new user
                const newUser=new User( {
                        name: userData.name,
                        email: userData.email,
                        password: hashedPassword,
                        bloodType: userData.bloodType,
                        phone: userData.phone,
                        createdAt: new Date(),
                } );

                await newUser.save();

                return { success: true };
        } catch ( error )
        {
                console.error( "Registration error:", error );
                return { success: false, error: "Failed to register user" };
        }
}

export async function loginUser ( credentials )
{
        try
        {
                // Connect to database first
                await connectToDatabase();

                // Find user by email
                const user=await User.findOne( { email: credentials.email } );
                if ( !user )
                {
                        return { success: false, error: "Invalid email or password" };
                }

                // Verify password
                const isPasswordValid=await bcrypt.compare(
                        credentials.password,
                        user.password
                );
                if ( !isPasswordValid )
                {
                        return { success: false, error: "Invalid email or password" };
                }

                // Create JWT token using jose
                const secretKey=new TextEncoder().encode( JWT_SECRET );

                const token=await new SignJWT( {
                        userId: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        bloodType: user.bloodType,
                } )
                        .setProtectedHeader( { alg: "HS256" } )
                        .setIssuedAt()
                        .setExpirationTime( "7d" )
                        .sign( secretKey );

                // Set cookie
                cookies().set( {
                        name: "auth_token",
                        value: token,
                        httpOnly: true,
                        path: "/",
                        secure: process.env.NODE_ENV==="production",
                        maxAge: 60*60*24*7, // 1 week
                } );

                return { success: true };
        } catch ( error )
        {
                console.error( "Login error:", error );
                return { success: false, error: "Failed to login" };
        }
}

export async function logoutUser ()
{
        cookies().delete( "auth_token" );
        return { success: true };
}
