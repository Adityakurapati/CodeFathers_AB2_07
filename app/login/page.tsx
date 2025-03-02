import { LoginForm } from "@/components/login-form"
import { Droplet } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

// Create a loading fallback component
const FormLoader = () => (
        <div className="w-full space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
)

export default function LoginPage() {
        return (
                <div className="min-h-screen flex flex-col">
                        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10">
                                <div className="w-full max-w-md space-y-6">
                                        <div className="space-y-2 text-center">
                                                <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-red-600">
                                                        <Droplet className="h-6 w-6" />
                                                        <span>BloodConnect</span>
                                                </Link>
                                                <h1 className="text-3xl font-bold">Login to your account</h1>
                                                <p className="text-gray-500">Enter your credentials to access your account</p>
                                        </div>

                                        {/* Wrap the LoginForm in a Suspense boundary */}
                                        <Suspense fallback={<FormLoader />}>
                                                <LoginForm />
                                        </Suspense>

                                        <div className="text-center text-sm">
                                                Don't have an account?{" "}
                                                <Link href="/register2" className="underline text-red-600">
                                                        Register
                                                </Link>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}