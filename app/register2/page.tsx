import { RegisterForm } from "@/components/register-form"
import { Droplet } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
        return (
                <div className="min-h-screen flex flex-col">
                        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10">
                                <div className="w-full max-w-md space-y-6">
                                        <div className="space-y-2 text-center">
                                                <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-red-600">
                                                        <Droplet className="h-6 w-6" />
                                                        <span>BloodConnect</span>
                                                </Link>
                                                <h1 className="text-3xl font-bold">Create an account</h1>
                                                <p className="text-gray-500">Enter your information to create an account</p>
                                        </div>
                                        <RegisterForm />
                                        <div className="text-center text-sm">
                                                Already have an account?{" "}
                                                <Link href="/login" className="underline text-red-600">
                                                        Login
                                                </Link>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}

