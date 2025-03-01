import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  cookies().delete("auth_token")

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL))
}

