"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, AmbulanceIcon, AlertTriangle, Calendar, User, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EmergencyMap } from "@/components/emergency-map"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AmbulancePage() {
  const [activeTab, setActiveTab] = useState("request")
  const [requestStatus, setRequestStatus] = useState("")
  const [requestTime, setRequestTime] = useState(0)

  useEffect(() => {
    if (requestStatus === "processing") {
      const interval = setInterval(() => {
        setRequestTime((prev) => {
          const newValue = prev + 5
          if (newValue >= 100) {
            setRequestStatus("confirmed")
            clearInterval(interval)
          }
          return newValue
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [requestStatus])

  const handleRequest = () => {
    setRequestStatus("processing")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <AmbulanceIcon className="h-5 w-5" />
          <h1 className="text-xl font-bold">Ambulance Services</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="pt-4">
            {!requestStatus ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AmbulanceIcon className="h-5 w-5" />
                    Request Ambulance Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <RadioGroup defaultValue="emergency">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="emergency" id="emergency" />
                          <Label htmlFor="emergency" className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            Emergency Transport
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-emergency" id="non-emergency" />
                          <Label htmlFor="non-emergency" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            Non-Emergency Transport
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medical" id="medical" />
                          <Label htmlFor="medical" className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Medical Transfer
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Pick-up Location</Label>
                        <Input placeholder="Current location" defaultValue="123 Main Street, Cityville" />
                      </div>
                      <div className="space-y-2">
                        <Label>Destination</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="citygeneral">City General Hospital</SelectItem>
                            <SelectItem value="memorial">Memorial Medical Center</SelectItem>
                            <SelectItem value="university">University Health System</SelectItem>
                            <SelectItem value="other">Other (specify)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Patient Information</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input placeholder="Patient Name" />
                        <Input placeholder="Contact Number" type="tel" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Medical Condition (Optional)</Label>
                      <Textarea placeholder="Describe the medical condition or reason for transport..." rows={3} />
                    </div>

                    <div className="space-y-2">
                      <Label>Special Requirements</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="wheelchair" />
                          <label htmlFor="wheelchair" className="text-sm">
                            Wheelchair Access
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="oxygen" />
                          <label htmlFor="oxygen" className="text-sm">
                            Oxygen Support
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="stretcher" />
                          <label htmlFor="stretcher" className="text-sm">
                            Stretcher
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="medical-staff" />
                          <label htmlFor="medical-staff" className="text-sm">
                            Medical Staff
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="md:w-auto w-full">
                            Get Cost Estimate
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Estimated Service Cost</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 items-center gap-4">
                              <p className="text-sm">Base Service Fee:</p>
                              <p className="text-sm font-medium">$150.00</p>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                              <p className="text-sm">Distance Fee (estimated):</p>
                              <p className="text-sm font-medium">$45.00</p>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4">
                              <p className="text-sm">Special Equipment:</p>
                              <p className="text-sm font-medium">$25.00</p>
                            </div>
                            <div className="grid grid-cols-2 items-center gap-4 border-t pt-2">
                              <p className="text-sm font-bold">Total Estimate:</p>
                              <p className="text-sm font-bold">$220.00</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Note: Actual costs may vary based on final distance and services provided. Most insurance
                              plans cover emergency medical transport.
                            </p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button onClick={handleRequest} className="md:w-auto w-full">
                        Request Ambulance
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : requestStatus === "processing" ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative w-20 h-20 mb-4">
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                      <div className="relative bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center">
                        <AmbulanceIcon className="h-10 w-10" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold">Processing Your Request</h2>
                    <p className="text-muted-foreground">
                      We're locating available ambulance services near you. This should only take a moment.
                    </p>
                    <div className="w-full max-w-md">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300 ease-in-out"
                          style={{ width: `${requestTime}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <Badge className="mb-4 text-base py-1.5 bg-green-500 hover:bg-green-600">
                      Ambulance Request Confirmed
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">Ambulance is on the way!</h2>
                    <p className="text-muted-foreground">
                      An ambulance has been dispatched to your location and will arrive shortly.
                    </p>
                  </div>

                  <div className="h-64 bg-muted rounded-md mb-6 relative overflow-hidden">
                    <EmergencyMap showResponders={true} />
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-bold mb-2">Response Team</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center">
                          <AmbulanceIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold">Ambulance #427</p>
                          <p className="text-sm text-muted-foreground">ETA: 8 minutes</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-bold mb-2">Request Details:</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-medium">Pick-up Location:</p>
                          <p>123 Main Street, Cityville</p>
                        </div>
                        <div>
                          <p className="font-medium">Destination:</p>
                          <p>City General Hospital</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Contact Ambulance Service</h3>
                      <div className="flex items-start gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button size="icon" className="h-10 w-10">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="destructive" onClick={() => setRequestStatus("")}>
                        Cancel Request
                      </Button>
                      <Button variant="outline">Call Dispatcher</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="pt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You have no scheduled ambulance services.</p>
                  <Button onClick={() => setActiveTab("request")}>Schedule a Transport</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">Recent Services</h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <Badge>Completed</Badge>
                        <span className="text-sm text-muted-foreground">March 2, 2025</span>
                      </div>
                      <h4 className="font-bold">Emergency Transport</h4>
                      <p className="text-sm text-muted-foreground mb-2">From: 123 Main Street, Cityville</p>
                      <p className="text-sm text-muted-foreground mb-2">To: City General Hospital</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>

                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <Badge>Completed</Badge>
                        <span className="text-sm text-muted-foreground">February 15, 2025</span>
                      </div>
                      <h4 className="font-bold">Medical Transfer</h4>
                      <p className="text-sm text-muted-foreground mb-2">From: Memorial Medical Center</p>
                      <p className="text-sm text-muted-foreground mb-2">To: Rehabilitation Center</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Ambulance Services</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted rounded-md text-center">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <h3 className="font-bold mb-1">Emergency</h3>
                <p className="text-sm text-muted-foreground">Immediate response for life-threatening emergencies</p>
              </div>
              <div className="p-4 bg-muted rounded-md text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold mb-1">Scheduled</h3>
                <p className="text-sm text-muted-foreground">Pre-planned medical transportation services</p>
              </div>
              <div className="p-4 bg-muted rounded-md text-center">
                <User className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-bold mb-1">Patient Transfer</h3>
                <p className="text-sm text-muted-foreground">Safe transfer between medical facilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

