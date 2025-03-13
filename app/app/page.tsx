import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Ambulance, Hospital, Users, Phone, HeartPulse } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6" />
          <h1 className="text-xl font-bold">MedConnect</h1>
        </div>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:underline">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto py-8 px-4">
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Emergency Medical Response</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect directly with hospitals, ambulance services, and first responders during emergencies. Get immediate
            assistance when you need it most.
          </p>

          <Link href="/emergency">
            <Button size="lg" variant="destructive" className="animate-pulse flex items-center gap-2 mb-8 mx-auto">
              <Phone className="h-5 w-5" />
              <span>Emergency Assistance</span>
            </Button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Hospital className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Hospital Connection</h3>
                <p className="text-muted-foreground mb-4">
                  Connect directly with nearby hospitals for emergency care coordination.
                </p>
                <Link href="/hospitals" className="text-primary hover:underline inline-flex items-center">
                  View Hospitals <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Ambulance className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Ambulance Services</h3>
                <p className="text-muted-foreground mb-4">
                  Request and track ambulance services in real-time during emergencies.
                </p>
                <Link href="/ambulance" className="text-primary hover:underline inline-flex items-center">
                  Request Ambulance <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">First Responders</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with trained first responders for immediate medical assistance.
                </p>
                <Link href="/responders" className="text-primary hover:underline inline-flex items-center">
                  Find Responders <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-muted rounded-xl p-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Request Assistance</h3>
              <p className="text-muted-foreground">Use the emergency button to request immediate medical assistance.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Share Information</h3>
              <p className="text-muted-foreground">Your location and medical profile are shared with responders.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Receive Help</h3>
              <p className="text-muted-foreground">
                Track responders in real-time as they arrive to provide assistance.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6 px-6 mt-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <HeartPulse className="h-5 w-5 text-primary" />
              <span className="font-bold">MedConnect</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} MedConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

