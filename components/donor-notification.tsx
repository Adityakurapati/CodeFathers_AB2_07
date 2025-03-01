"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Clock, MapPin, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface DonorNotificationProps {
  request: {
    id: string
    patientName: string
    bloodType: string
    urgencyLevel: string
    hospital: string
    location: { lat: number; lng: number }
    distance: string
  }
  onClose: () => void
}

export function DonorNotification({ request, onClose }: DonorNotificationProps) {
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">("pending")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAccept = () => {
    setStatus("accepted")
    // In a real app, you would send this to your API
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const handleDecline = () => {
    setStatus("declined")
    // In a real app, you would send this to your API
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return (
          <Badge variant="destructive" className="animate-pulse">
            Critical
          </Badge>
        )
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

  if (status === "pending") {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md w-full animate-in slide-in-from-right-10">
        <Card className={`border-2 ${request.urgencyLevel === "critical" ? "border-red-500" : "border-primary"}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className={`h-5 w-5 ${request.urgencyLevel === "critical" ? "text-red-500" : "text-primary"}`}
                  />
                  <CardTitle>Blood Donation Request</CardTitle>
                </div>
                <CardDescription>You have a new matching blood request</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Patient:</span>
                <span>{request.patientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Blood Type:</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {request.bloodType}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Urgency Level:</span>
                {getUrgencyBadge(request.urgencyLevel)}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Hospital:</span>
                <span>{request.hospital}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Distance:</span>
                <span className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {request.distance}
                </span>
              </div>

              {isExpanded && (
                <div className="pt-2 space-y-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    This patient urgently needs your blood type. Your donation could save their life.
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>
                      {request.urgencyLevel === "critical"
                        ? "Needed immediately"
                        : request.urgencyLevel === "high"
                          ? "Needed within 24 hours"
                          : "Needed within 48 hours"}
                    </span>
                  </div>
                </div>
              )}

              <Button variant="link" size="sm" className="px-0 h-auto" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Show less" : "Show more details"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleDecline}>
              Decline
            </Button>
            <Button onClick={handleAccept}>Accept Request</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (status === "accepted") {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md w-full animate-in slide-in-from-right-10">
        <Card className="border-2 border-green-500">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <CardTitle>Request Accepted</CardTitle>
            </div>
            <CardDescription>Thank you for accepting this blood donation request. You're a lifesaver!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Directions to {request.hospital} have been sent to your email and phone.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

