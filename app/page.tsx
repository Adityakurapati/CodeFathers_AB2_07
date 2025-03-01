import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Droplet, Heart, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
          <Droplet className="h-6 w-6" />
          <span>BloodConnect</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/donors" className="text-sm font-medium hover:underline underline-offset-4">
            Donors
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              Register
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-red-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-600">
                  Donate Blood, Save Lives
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our community of blood donors and help save lives. Every donation counts and can make a
                  difference.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button className="bg-red-600 hover:bg-red-700">
                      Become a Donor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/donors">
                    <Button variant="outline">Find Donors</Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Blood Donation"
                  className="rounded-lg object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-red-600">Why Donate Blood?</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Your donation can help accident victims, surgery patients, and those battling cancer.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 border rounded-lg p-6 shadow-sm">
                <div className="p-3 rounded-full bg-red-100">
                  <Heart className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Save Lives</h3>
                <p className="text-center text-gray-500">
                  A single donation can save up to three lives and help countless others.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 border rounded-lg p-6 shadow-sm">
                <div className="p-3 rounded-full bg-red-100">
                  <Users className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Community Impact</h3>
                <p className="text-center text-gray-500">
                  Join a community of donors making a difference in your local area.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 border rounded-lg p-6 shadow-sm">
                <div className="p-3 rounded-full bg-red-100">
                  <Droplet className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Health Benefits</h3>
                <p className="text-center text-gray-500">
                  Regular donors receive free health check-ups and can reduce the risk of heart disease.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} BloodConnect. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

