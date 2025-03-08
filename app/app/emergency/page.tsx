"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, ArrowLeft, MapPin, Phone, Clock, Loader2, User, FileText, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { EmergencyMap } from "@/components/emergency-map"
import { EmergencyPulse } from "@/components/emergency-pulse"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EmergencyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [emergencyType, setEmergencyType] = useState("")
  const [description, setDescription] = useState("")
  const [requestSent, setRequestSent] = useState(false)
  const [responseTime, setResponseTime] = useState(0)
  const [responderStatus, setResponderStatus] = useState("locating")

  // Simulate geolocation and progress
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setStep(3), 3000)
      return () => clearTimeout(timer)
    }

    if (requestSent) {
      const interval = setInterval(() => {
        setResponseTime((prev) => {
          const newValue = prev + 5
          if (newValue >= 100) {
            setResponderStatus("en-route")
            clearInterval(interval)
          }
          return newValue
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [step, requestSent])

  const handleEmergencyRequest = () => {
    if (!emergencyType) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setRequestSent(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-destructive text-destructive-foreground py-4 px-6 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <h1 className="text-xl font-bold">Emergency Assistance</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {!requestSent ? (
          <>
            <div className="max-w-lg mx-auto mb-8">
              <div className="flex items-center justify-between mb-6">
                <EmergencyPulse />
                <div className="flex items-center gap-1">
                  <Badge variant={step >= 1 ? "default" : "outline"}>Location</Badge>
                  <Badge variant={step >= 2 ? "default" : "outline"}>Details</Badge>
                  <Badge variant={step >= 3 ? "default" : "outline"}>Request</Badge>
                </div>
              </div>

              {step === 1 && (
                <Card className="mb-6 border-destructive">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-destructive" />
                      Confirm Your Location
                    </h2>
                    <div className="h-64 bg-muted rounded-md mb-4 relative overflow-hidden">
                      <EmergencyMap />
                      <div className="absolute top-4 left-4 bg-background p-2 rounded-md shadow text-sm">
                        <p className="font-bold">Current Location:</p>
                        <p>123 Main Street, Cityville</p>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => setStep(2)}>
                      Confirm Location
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card className="mb-6 border-destructive">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-destructive" />
                      Emergency Details
                    </h2>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Emergency Type</label>
                      <Select onValueChange={setEmergencyType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select emergency type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
                          <SelectItem value="breathing">Breathing Difficulty</SelectItem>
                          <SelectItem value="injury">Severe Injury</SelectItem>
                          <SelectItem value="stroke">Stroke Symptoms</SelectItem>
                          <SelectItem value="other">Other Medical Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Additional Details</label>
                      <Textarea
                        placeholder="Describe the emergency situation..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="resize-none"
                        rows={4}
                      />
                    </div>

                    <Button className="w-full" onClick={() => setStep(3)} disabled={!emergencyType}>
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card className="mb-6 border-destructive">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-destructive" />
                      Request Emergency Response
                    </h2>

                    <div className="bg-muted p-4 rounded-md mb-4">
                      <h3 className="font-bold mb-2">Emergency Summary</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium">Location:</p>
                          <p>123 Main Street, Cityville</p>
                        </div>
                        <div>
                          <p className="font-medium">Emergency Type:</p>
                          <p className="capitalize">{emergencyType || "Not specified"}</p>
                        </div>
                        {description && (
                          <div className="col-span-2 mt-2">
                            <p className="font-medium">Details:</p>
                            <p>{description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={handleEmergencyRequest}
                        disabled={loading || !emergencyType}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>Request Emergency Help</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-lg mx-auto">
            <Card className="border-destructive mb-6">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Badge variant="destructive" className="mb-4 text-base py-1.5">
                    Emergency Response Active
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">Help is on the way!</h2>
                  <p className="text-muted-foreground">
                    Emergency services have been notified and responders are being dispatched to your location.
                  </p>
                </div>

                <div className="h-64 bg-muted rounded-md mb-6 relative overflow-hidden">
                  <EmergencyMap showResponders={responderStatus === "en-route"} />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Responder Status:</span>
                      <span className="capitalize font-bold">
                        {responderStatus === "locating" ? "Locating nearest responders" : "En route to your location"}
                      </span>
                    </div>
                    <Progress value={responseTime} className="h-2" />
                  </div>

                  {responderStatus === "en-route" && (
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-bold mb-2">Response Team</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold">Ambulance #427</p>
                          <p className="text-sm text-muted-foreground">ETA: 8 minutes</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Tabs defaultValue="instructions">
                    <TabsList className="w-full">
                      <TabsTrigger value="instructions" className="flex-1">
                        Instructions
                      </TabsTrigger>
                      <TabsTrigger value="contacts" className="flex-1">
                        Emergency Contacts
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="instructions" className="p-4 bg-muted rounded-md mt-2">
                      <h3 className="font-bold mb-2">While Waiting:</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Heart className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                          Stay calm and keep the patient comfortable
                        </li>
                        <li className="flex items-start gap-2">
                          <Clock className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                          Do not give food or water to the patient
                        </li>
                        <li className="flex items-start gap-2">
                          <Phone className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                          Keep your phone nearby to communicate with responders
                        </li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="contacts" className="p-4 bg-muted rounded-md mt-2">
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-bold">Emergency Dispatch</p>
                          <p className="text-destructive">+1 (555) 911-0000</p>
                        </div>
                        <div>
                          <p className="font-bold">City Hospital ER</p>
                          <p className="text-destructive">+1 (555) 867-5309</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button variant="outline" className="w-full" onClick={() => router.push("/emergency/status")}>
                    View Detailed Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

