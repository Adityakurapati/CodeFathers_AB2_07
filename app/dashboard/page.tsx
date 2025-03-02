"use client"

import { useState, useEffect } from "react"
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

// Import the server actions
import { getAvailableRequests, getUserRequests, updateRequestStatus } from "@/lib/actions/request-actions"
import { getDonationHistory } from "@/lib/actions/donation-actions"
import { getMatches, createMatch, updateMatchStatus } from "@/lib/actions/match-actions"

export default function DashboardPage() {
        const searchParams = useSearchParams()
        const requestSubmitted = searchParams.get("requestSubmitted") === "true"
        const [userType, setUserType] = useState<"donor" | "recipient">("donor")
        const [showNotification, setShowNotification] = useState(false)
        const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

        // State for data from MongoDB
        const [availableRequests, setAvailableRequests] = useState([])
        const [userRequests, setUserRequests] = useState([])
        const [donationHistory, setDonationHistory] = useState([])
        const [matches, setMatches] = useState([])
        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState("")

        // Fetch data on component mount
        useEffect(() => {
                async function fetchData() {
                        setIsLoading(true)
                        setError("")

                        try {
                                // Fetch data based on user type
                                if (userType === "donor") {
                                        const [requestsRes, donationsRes, matchesRes] = await Promise.all([
                                                getAvailableRequests(),
                                                getDonationHistory(),
                                                getMatches()
                                        ])

                                        if (requestsRes.success) setAvailableRequests(requestsRes.data)
                                        if (donationsRes.success) setDonationHistory(donationsRes.data)
                                        if (matchesRes.success) setMatches(matchesRes.data)
                                } else {
                                        const userRequestsRes = await getUserRequests()
                                        if (userRequestsRes.success) setUserRequests(userRequestsRes.data)
                                }
                        } catch (err) {
                                console.error("Error fetching dashboard data:", err)
                                setError("Failed to load data. Please try again.")
                        } finally {
                                setIsLoading(false)
                        }
                }

                fetchData()
        }, [userType])

        // For demonstration, we'll show a notification after 3 seconds
        useEffect(() => {
                if (matches.length > 0) {
                        const timer = setTimeout(() => {
                                setShowNotification(true)
                        }, 3000)

                        return () => clearTimeout(timer)
                }
        }, [matches])

        const handleViewOnMap = (location: { lat: number; lng: number }) => {
                setSelectedLocation(location)
        }

        const handleVolunteerToDonate = async (requestId: string) => {
                try {
                        const result = await createMatch(requestId)
                        if (result.success) {
                                // Refresh matches data
                                const matchesRes = await getMatches()
                                if (matchesRes.success) setMatches(matchesRes.data)

                                // Refresh available requests
                                const requestsRes = await getAvailableRequests()
                                if (requestsRes.success) setAvailableRequests(requestsRes.data)
                        } else {
                                setError(result.error || "Failed to volunteer for donation")
                        }
                } catch (err) {
                        console.error("Error volunteering to donate:", err)
                        setError("Failed to volunteer for donation. Please try again.")
                }
        }

        const handleMatchUpdate = async (matchId: string, status: string) => {
                try {
                        const result = await updateMatchStatus(matchId, status)
                        if (result.success) {
                                // Refresh matches data
                                const matchesRes = await getMatches()
                                if (matchesRes.success) setMatches(matchesRes.data)
                        } else {
                                setError(result.error || `Failed to ${status} match`)
                        }
                } catch (err) {
                        console.error(`Error ${status} match:`, err)
                        setError(`Failed to ${status} match. Please try again.`)
                }
        }

        const handleCancelRequest = async (requestId: string) => {
                try {
                        const result = await updateRequestStatus(requestId, "cancelled")
                        if (result.success) {
                                // Refresh user requests
                                const userRequestsRes = await getUserRequests()
                                if (userRequestsRes.success) setUserRequests(userRequestsRes.data)
                        } else {
                                setError(result.error || "Failed to cancel request")
                        }
                } catch (err) {
                        console.error("Error cancelling request:", err)
                        setError("Failed to cancel request. Please try again.")
                }
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
                        {showNotification && matches.length > 0 && (
                                <DonorNotification
                                        request={matches[0].request}
                                        onClose={() => setShowNotification(false)}
                                />
                        )}

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
                                                        {matches.length > 0 && (
                                                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                                                        )}
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

                                        {error && (
                                                <Alert className="mb-6 bg-red-50 border-red-200">
                                                        <AlertTitle className="text-red-800">Error</AlertTitle>
                                                        <AlertDescription className="text-red-700">{error}</AlertDescription>
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

                                                        {isLoading ? (
                                                                <div className="flex justify-center items-center h-64">
                                                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                                                </div>
                                                        ) : userType === "donor" ? (
                                                                <Tabs defaultValue="matches">
                                                                        <TabsList className="grid w-full grid-cols-3">
                                                                                <TabsTrigger value="matches">Matches</TabsTrigger>
                                                                                <TabsTrigger value="requests">Available Requests</TabsTrigger>
                                                                                <TabsTrigger value="history">Donation History</TabsTrigger>
                                                                        </TabsList>

                                                                        <TabsContent value="matches" className="space-y-4 pt-4">
                                                                                <h2 className="text-xl font-semibold">Your Matched Requests</h2>
                                                                                {matches.length > 0 ? (
                                                                                        <div className="grid gap-4">
                                                                                                {matches.map((match) => (
                                                                                                        <Card key={match._id}>
                                                                                                                <CardHeader className="pb-2">
                                                                                                                        <div className="flex justify-between items-start">
                                                                                                                                <div>
                                                                                                                                        <CardTitle>{match.request.patientName}</CardTitle>
                                                                                                                                        <CardDescription>
                                                                                                                                                {match.request.hospital} • {match.request.distance || "Unknown distance"}
                                                                                                                                        </CardDescription>
                                                                                                                                </div>
                                                                                                                                <div className="flex flex-col items-end gap-1">
                                                                                                                                        <Badge variant="outline" className="bg-primary/10 text-primary">
                                                                                                                                                Blood Type: {match.request.bloodType}
                                                                                                                                        </Badge>
                                                                                                                                        {getUrgencyBadge(match.request.urgencyLevel)}
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
                                                                                                                        <Button
                                                                                                                                variant="outline"
                                                                                                                                size="sm"
                                                                                                                                onClick={() => handleViewOnMap(match.request.location)}
                                                                                                                                disabled={!match.request.location}
                                                                                                                        >
                                                                                                                                <MapPin className="mr-1 h-4 w-4" />
                                                                                                                                View on Map
                                                                                                                        </Button>
                                                                                                                        <div className="flex gap-2">
                                                                                                                                <Button
                                                                                                                                        variant="outline"
                                                                                                                                        size="sm"
                                                                                                                                        onClick={() => handleMatchUpdate(match._id, "declined")}
                                                                                                                                        disabled={match.status !== "matched"}
                                                                                                                                >
                                                                                                                                        Decline
                                                                                                                                </Button>
                                                                                                                                <Button
                                                                                                                                        size="sm"
                                                                                                                                        onClick={() => handleMatchUpdate(match._id, "accepted")}
                                                                                                                                        disabled={match.status !== "matched"}
                                                                                                                                >
                                                                                                                                        Accept
                                                                                                                                </Button>
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
                                                                                <h2 className="text-xl font-semibold">Available Blood Requests</h2>
                                                                                {availableRequests.length > 0 ? (
                                                                                        <div className="grid gap-4">
                                                                                                {availableRequests.map((request) => (
                                                                                                        <Card key={request._id}>
                                                                                                                <CardHeader className="pb-2">
                                                                                                                        <div className="flex justify-between items-start">
                                                                                                                                <div>
                                                                                                                                        <CardTitle>{request.patientName}</CardTitle>
                                                                                                                                        <CardDescription>
                                                                                                                                                {request.hospital} • {request.distance || "Unknown distance"}
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
                                                                                                                        <p className="mt-2 text-sm">{request.notes}</p>
                                                                                                                </CardContent>
                                                                                                                <CardFooter className="flex justify-between">
                                                                                                                        <Button
                                                                                                                                variant="outline"
                                                                                                                                size="sm"
                                                                                                                                onClick={() => handleViewOnMap(request.location)}
                                                                                                                                disabled={!request.location}
                                                                                                                        >
                                                                                                                                <MapPin className="mr-1 h-4 w-4" />
                                                                                                                                View on Map
                                                                                                                        </Button>
                                                                                                                        <Button
                                                                                                                                size="sm"
                                                                                                                                onClick={() => handleVolunteerToDonate(request._id)}
                                                                                                                        >
                                                                                                                                Volunteer to Donate
                                                                                                                        </Button>
                                                                                                                </CardFooter>
                                                                                                        </Card>
                                                                                                ))}
                                                                                        </div>
                                                                                ) : (
                                                                                        <div className="text-center py-8 text-muted-foreground">
                                                                                                No blood requests available at this time.
                                                                                        </div>
                                                                                )}
                                                                        </TabsContent>

                                                                        <TabsContent value="history" className="space-y-4 pt-4">
                                                                                <h2 className="text-xl font-semibold">Your Donation History</h2>
                                                                                {donationHistory.length > 0 ? (
                                                                                        <div className="grid gap-4">
                                                                                                {donationHistory.map((donation) => (
                                                                                                        <Card key={donation._id}>
                                                                                                                <CardHeader className="pb-2">
                                                                                                                        <div className="flex justify-between items-start">
                                                                                                                                <CardTitle>{donation.request.patientName}</CardTitle>
                                                                                                                                <Badge variant={donation.status === "completed" ? "success" : "secondary"}>
                                                                                                                                        {donation.status === "completed" ? "Completed" : "Scheduled"}
                                                                                                                                </Badge>
                                                                                                                        </div>
                                                                                                                        <CardDescription>{donation.request.hospital}</CardDescription>
                                                                                                                </CardHeader>
                                                                                                                <CardContent className="pb-2">
                                                                                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                                                                                                <Clock className="mr-1 h-4 w-4" />
                                                                                                                                <span>{new Date(donation.donationDate).toLocaleDateString()}</span>
                                                                                                                        </div>
                                                                                                                </CardContent>
                                                                                                                <CardFooter>
                                                                                                                        <Button
                                                                                                                                variant="outline"
                                                                                                                                size="sm"
                                                                                                                                className="ml-auto"
                                                                                                                                asChild
                                                                                                                        >
                                                                                                                                <Link href={`/donations/${donation._id}`}>
                                                                                                                                        View Details
                                                                                                                                </Link>
                                                                                                                        </Button>
                                                                                                                </CardFooter>
                                                                                                        </Card>
                                                                                                ))}
                                                                                        </div>
                                                                                ) : (
                                                                                        <div className="text-center py-8 text-muted-foreground">
                                                                                                You haven't made any donations yet.
                                                                                        </div>
                                                                                )}
                                                                        </TabsContent>
                                                                </Tabs>
                                                        ) : (
                                                                <div className="space-y-6">
                                                                        <div className="flex justify-between items-center">
                                                                                <h2 className="text-xl font-semibold">Your Blood Requests</h2>
                                                                                <Button asChild>
                                                                                        <Link href="/emergency-request">Create New Request</Link>
                                                                                </Button>
                                                                        </div>

                                                                        {userRequests.length > 0 ? (
                                                                                <div className="grid gap-4">
                                                                                        {userRequests.map((request) => (
                                                                                                <Card key={request._id}>
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
                                                                                                                                <Badge variant={
                                                                                                                                        request.status === "pending" ? "secondary" :
                                                                                                                                                request.status === "matched" ? "success" :
                                                                                                                                                        request.status === "fulfilled" ? "success" : "outline"
                                                                                                                                }>
                                                                                                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                                                                                                </Badge>
                                                                                                                        </div>
                                                                                                                </div>
                                                                                                        </CardHeader>
                                                                                                        <CardContent className="pb-2">
                                                                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                                                                        <Clock className="mr-1 h-4 w-4" />
                                                                                                                        <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                                                                                                                </div>
                                                                                                                <p className="mt-2 text-sm">{request.notes}</p>
                                                                                                        </CardContent>
                                                                                                        <CardFooter className="flex justify-between">
                                                                                                                <Button
                                                                                                                        variant="outline"
                                                                                                                        size="sm"
                                                                                                                        onClick={() => handleCancelRequest(request._id)}
                                                                                                                        disabled={request.status !== "pending"}
                                                                                                                >
                                                                                                                        Cancel Request
                                                                                                                </Button>
                                                                                                                <Button
                                                                                                                        variant="outline"
                                                                                                                        size="sm"
                                                                                                                        asChild
                                                                                                                >
                                                                                                                        <Link href={`/requests/${request._id}`}>
                                                                                                                                View Details
                                                                                                                        </Link>
                                                                                                                </Button>
                                                                                                        </CardFooter>
                                                                                                </Card>
                                                                                        ))}
                                                                                </div>
                                                                        ) : (
                                                                                <div className="text-center py-8 text-muted-foreground">
                                                                                        You haven't created any blood requests yet.
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        )}
                                                </div>

                                                <div className="md:w-1/3">
                                                        <Card>
                                                                <CardHeader>
                                                                        <CardTitle>Location</CardTitle>
                                                                        <CardDescription>View donation centers or request locations</CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="h-96">
                                                                        // For showing a path between two locations:
                                                                        <MapComponent
                                                                                startLocation={{ lat: 37.7749, lng: -122.4194 }}
                                                                                endLocation={{ lat: 37.8049, lng: -122.4314 }}
                                                                        />

                                                                        {selectedLocation ? (
                                                                                <MapComponent location={selectedLocation} />
                                                                        ) : (
                                                                                <div className="flex items-center justify-center h-full border rounded-md border-dashed text-muted-foreground">
                                                                                        Select a request to view its location on the map
                                                                                </div>
                                                                        )}
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </div>
                        </main >

                        <footer className="border-t py-6">
                                <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Droplet className="h-4 w-4" />
                                                <span>&copy; 2025 BloodConnect. All rights reserved.</span>
                                        </div>
                                        <div className="flex gap-4">
                                                <Link href="/about" className="text-sm text-muted-foreground hover:underline">
                                                        About
                                                </Link>
                                                <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                                                        Privacy
                                                </Link>
                                                <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                                                        Terms
                                                </Link>
                                                <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                                                        Contact
                                                </Link>
                                        </div>
                                </div>
                        </footer>
                </div >
        )
}