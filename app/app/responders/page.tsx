"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, Clock, Heart, Shield, Star, MapPin, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const responders = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Emergency Medical Technician",
    distance: "0.8 miles",
    rating: 4.9,
    responseTime: "3-5 min",
    specialties: ["CPR", "First Aid", "AED"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Registered Nurse",
    distance: "1.2 miles",
    rating: 4.8,
    responseTime: "4-6 min",
    specialties: ["Cardiac Care", "Trauma", "Pediatric"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "Paramedic",
    distance: "1.5 miles",
    rating: 5.0,
    responseTime: "5-7 min",
    specialties: ["Advanced Life Support", "Critical Care", "Transport"],
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function RespondersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredResponders = responders.filter(
    (responder) =>
      responder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      responder.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      responder.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h1 className="text-xl font-bold">First Responders</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Input
              placeholder="Search for responders by name, role, or specialty"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-lg"
            />
          </div>

          <Tabs defaultValue="nearby" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="specialists">Specialists</TabsTrigger>
              <TabsTrigger value="teams">Response Teams</TabsTrigger>
            </TabsList>

            <TabsContent value="nearby">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResponders.map((responder) => (
                  <Card key={responder.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="flex p-4">
                      <div className="mr-4">
                        <Image
                          src={responder.image || "/placeholder.svg"}
                          alt={responder.name}
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold">{responder.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{responder.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{responder.role}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {responder.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{responder.distance}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Response: {responder.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-t">
                      <Link
                        href={`/responders/${responder.id}`}
                        className="p-3 text-center text-sm font-medium hover:bg-muted transition-colors"
                      >
                        View Profile
                      </Link>
                      <Link
                        href={`/responders/${responder.id}/contact`}
                        className="p-3 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors border-l"
                      >
                        Request Help
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specialists">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Select Specialty Area</h3>
                      <RadioGroup defaultValue="cardiac">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cardiac" id="cardiac" />
                            <Label htmlFor="cardiac" className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              Cardiac Emergency
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="trauma" id="trauma" />
                            <Label htmlFor="trauma" className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-blue-500" />
                              Trauma & Injury
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pediatric" id="pediatric" />
                            <Label htmlFor="pediatric">Pediatric Emergency</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="psychiatric" id="psychiatric" />
                            <Label htmlFor="psychiatric">Mental Health Crisis</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button className="w-full md:w-auto">Find Specialist Responders</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center p-8 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-4">Select a specialty area to find qualified responders.</p>
              </div>
            </TabsContent>

            <TabsContent value="teams">
              <div className="grid gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">City Emergency Response Team</h3>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      A coordinated team of paramedics, EMTs, and medical professionals trained to respond to
                      large-scale emergencies.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">Mass Casualty</Badge>
                      <Badge variant="outline">Disaster Response</Badge>
                      <Badge variant="outline">Coordination</Badge>
                    </div>
                    <Button className="w-full">Contact Team</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Community Medical Response Unit</h3>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Volunteer healthcare professionals providing emergency medical assistance within the local
                      community.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">First Aid</Badge>
                      <Badge variant="outline">CPR</Badge>
                      <Badge variant="outline">Basic Life Support</Badge>
                    </div>
                    <Button className="w-full">Contact Team</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Why Choose First Responders?</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-md text-center">
                  <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h3 className="font-bold mb-1">Rapid Response</h3>
                  <p className="text-sm text-muted-foreground">Immediate assistance before ambulance arrival</p>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h3 className="font-bold mb-1">Trained Professionals</h3>
                  <p className="text-sm text-muted-foreground">Certified in emergency medical procedures</p>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h3 className="font-bold mb-1">Local Assistance</h3>
                  <p className="text-sm text-muted-foreground">Community-based responders who know the area</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="font-bold mb-2">First Responder Network</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our network consists of certified emergency medical professionals, including paramedics, EMTs, nurses,
                  and doctors who volunteer their time to provide rapid assistance during emergencies.
                </p>
                <Link href="/responders/join" className="text-primary hover:underline inline-flex items-center">
                  Learn how to become a responder <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

