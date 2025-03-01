"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Bell, Calendar, CheckCircle, Clock, Droplet, Home, MapPin, User } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { DonorNotification } from "@/components/donor-notification"
import { MapComponent } from "@/components/map-component"

// Mock data for demonstration
const mockRequests = [
  {
    id: "req-001",
    patientName: "John Smith",
    bloodType: "O+",
    urgencyLevel: "high",
    hospital: "City General Hospital",
    location: { lat: 40.7128, lng: -74.006 },
    distance: "2.3 miles",
    requestDate: "2023-03-01T10:30:00",
    status: "pending",
  },
  {
    id: "req-002",
    patientName: "Mary Johnson",
    bloodType: "AB-",
    urgencyLevel: "critical",
    hospital: "Memorial Medical Center",
    location: { lat: 40.7328, lng: -73.996 },
    distance: "3.7 miles",
    requestDate: "2023-03-01T09:15:00",
    status: "pending",
  },
  {
    id: "req-003",
    patientName: "Robert Davis",
    bloodType: "A+",
    urgencyLevel: "medium",
    hospital: "St. Luke's Hospital",
    location: { lat: 40.7028, lng: -74.016 },
    distance: "1.5 miles",
    requestDate: "2023-03-01T11:45:00",
    status: "pending",
  },
]

const mockDonations = [
  {
    id: "don-001",
    recipient: "Sarah Williams",
    bloodType: "B+",
    hospital: "City General Hospital",
    donationDate: "2023-02-15T14:30:00",
    status: "completed",
  },
  {
    id: "don-002",
    recipient: "James Brown",
    bloodType: "O-",
    hospital: "Memorial Medical Center",
    donationDate: "2023-01-20T10:15:00",
    status: "completed",
  },
]

const mockMatches = [
  {
    id: "match-001",
    patientName: "Emily Wilson",
    bloodType: "A+",
    urgencyLevel: "high",
    hospital: "City General Hospital",
    location: { lat: 40.7128, lng: -74.006 },
    distance: "2.3 miles",
    matchDate: "2023-03-01T10:30:00",
    status: "matched",
  },
  {
    id: "match-002",
    patientName: "Michael Thompson",
    bloodType: "O+",
    urgencyLevel: "critical",
    hospital: "Memorial Medical Center",
    location: { lat: 40.7328, lng: -73.996 },
    distance: "3.7 miles",
    matchDate: "2023-03-01T09:15:00",
    status: "matched",
  },
]

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const requestSubmitted = searchParams.get("requestSubmitted") === "true"
  const [userType, setUserType] = useState<"donor" | "recipient">("donor")
  const [showNotification, setShowNotification] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  // For demonstration, we'll show a notification after 3 seconds
  useState(() => {
    const timer = setTimeout(() => {
      setShowNotification(true)
    }, 3000)

    return () => clearTimeout(timer)
  })

  const handleViewOnMap = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location)
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Medium
          </Badge>
        )
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {showNotification && <DonorNotification request={mockMatches[1]} onClose={() => setShowNotification(false)} />}

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Droplet className="h-6 w-6 fill-primary" />
            <span>BloodConnect</span>
          </div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-1">
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

      <main className="flex-1">
        <div className="container py-6">
          {requestSubmitted && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Request Submitted Successfully</AlertTitle>
              <AlertDescription className="text-green-700">
                Your emergency blood request has been submitted. We are now searching for matching donors in your area.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-6 md:flex-row">
            <div className="md:w-2/3 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                  <Button variant={userType === "donor" ? "default" : "outline"} onClick={() => setUserType("donor")}>
                    Donor View
                  </Button>
                  <Button
                    variant={userType === "recipient" ? "default" : "outline"}
                    onClick={() => setUserType("recipient")}
                  >
                    Recipient View
                  </Button>
                </div>
              </div>

              {userType === "donor" ? (
                <Tabs defaultValue="matches">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="matches">Matches</TabsTrigger>
                    <TabsTrigger value="requests">Available Requests</TabsTrigger>
                    <TabsTrigger value="history">Donation History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="matches" className="space-y-4 pt-4">
                    <h2 className="text-xl font-semibold">Your Matched Requests</h2>
                    {mockMatches.length > 0 ? (
                      <div className="grid gap-4">
                        {mockMatches.map((match) => (
                          <Card key={match.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle>{match.patientName}</CardTitle>
                                  <CardDescription>
                                    {match.hospital} • {match.distance}
                                  </CardDescription>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <Badge variant="outline" className="bg-primary/10 text-primary">
                                    Blood Type: {match.bloodType}
                                  </Badge>
                                  {getUrgencyBadge(match.urgencyLevel)}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>Matched on {new Date(match.matchDate).toLocaleDateString()}</span>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button variant="outline" size="sm" onClick={() => handleViewOnMap(match.location)}>
                                <MapPin className="mr-1 h-4 w-4" />
                                View on Map
                              </Button>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Decline
                                </Button>
                                <Button size="sm">Accept</Button>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No matches found. We'll notify you when there's a match.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="requests" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Available Blood Requests</h2>
                      <Badge variant="outline" className="px-3">
                        {mockRequests.length} Requests
                      </Badge>
                    </div>

                    <div className="grid gap-4">
                      {mockRequests.map((request) => (
                        <Card key={request.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{request.patientName}</CardTitle>
                                <CardDescription>
                                  {request.hospital} • {request.distance}
                                </CardDescription>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  Blood Type: {request.bloodType}
                                </Badge>
                                {getUrgencyBadge(request.urgencyLevel)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => handleViewOnMap(request.location)}>
                              <MapPin className="mr-1 h-4 w-4" />
                              View on Map
                            </Button>
                            <Button size="sm">Volunteer to Donate</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4 pt-4">
                    <h2 className="text-xl font-semibold">Your Donation History</h2>
                    {mockDonations.length > 0 ? (
                      <div className="grid gap-4">
                        {mockDonations.map((donation) => (
                          <Card key={donation.id}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle>Donation to {donation.recipient}</CardTitle>
                                  <CardDescription>
                                    {donation.hospital} • Blood Type: {donation.bloodType}
                                  </CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                  Completed
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>Donated on {new Date(donation.donationDate).toLocaleDateString()}</span>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" size="sm">
                                View Certificate
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No donation history found. Start donating to save lives!
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <Tabs defaultValue="active">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Active Requests</TabsTrigger>
                    <TabsTrigger value="history">Request History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Your Active Requests</h2>
                      <Link href="/emergency-request">
                        <Button>New Emergency Request</Button>
                      </Link>
                    </div>

                    <div className="grid gap-4">
                      {mockRequests.slice(0, 2).map((request) => (
                        <Card key={request.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{request.patientName}</CardTitle>
                                <CardDescription>{request.hospital}</CardDescription>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  Blood Type: {request.bloodType}
                                </Badge>
                                {getUrgencyBadge(request.urgencyLevel)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Status:</span> Searching for donors
                            </div>
                            <Button variant="outline" size="sm">
                              Cancel Request
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4 pt-4">
                    <h2 className="text-xl font-semibold">Your Request History</h2>
                    <div className="grid gap-4">
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>Sarah Williams</CardTitle>
                              <CardDescription>City General Hospital • Blood Type: B+</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              Fulfilled
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>Requested on Feb 15, 2023</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>

            <div className="md:w-1/3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Location Map</CardTitle>
                  <CardDescription>View nearby donors and blood requests</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <MapComponent
                    markers={mockRequests.map((req) => ({
                      position: req.location,
                      title: req.hospital,
                      type: "request",
                    }))}
                    selectedLocation={selectedLocation}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

