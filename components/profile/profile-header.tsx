import Link from "next/link"
import { Bell, Calendar, Droplet, Home, User } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ProfileHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Droplet className="h-6 w-6 fill-primary" />
          <span>BloodConnect</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/donor" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/appointments" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </nav>
      </div>
    </header>
  )
}

