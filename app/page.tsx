import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary-foreground">Blood Donation Connect</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold">Save Lives Through Blood Donation</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Connect blood donors with recipients in real-time for emergency situations.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/recipient-view">Request Blood</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Link href="/donor-view">Donor Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Blood Donation Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

