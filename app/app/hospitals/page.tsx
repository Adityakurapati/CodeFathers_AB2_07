"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Clock, Star, Search, Filter, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

const hospitals = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Main Street, Cityville",
    distance: "2.3 miles",
    rating: 4.8,
    waitTime: "15-20 min",
    specialties: ["Emergency", "Trauma", "Cardiac"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Memorial Medical Center",
    address: "456 Oak Avenue, Townsburg",
    distance: "4.1 miles",
    rating: 4.6,
    waitTime: "5-10 min",
    specialties: ["Emergency", "Pediatric", "Neurology"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "University Health System",
    address: "789 College Blvd, Eduville",
    distance: "6.7 miles",
    rating: 4.9,
    waitTime: "30-40 min",
    specialties: ["Emergency", "Burn Unit", "Critical Care"],
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function HospitalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [maxDistance, setMaxDistance] = useState([10])
  const [specialtyFilters, setSpecialtyFilters] = useState([
    "Emergency",
    "Trauma",
    "Cardiac",
    "Pediatric",
    "Neurology",
    "Burn Unit",
  ])

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      Number.parseFloat(hospital.distance) <= maxDistance[0],
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Nearby Hospitals</h1>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search hospitals..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Hospitals</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <Label>Maximum Distance ({maxDistance[0]} miles)</Label>
                  <Slider 
                    defaultValue={[10]} 
                    max={20} 
                    step={1} 
                    onValueChange={setMaxDistance} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Specialties</Label>
                  <div className="space-y-2">
                    {specialtyFilters.map(specialty => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox id={specialty} defaultChecked />
                        <label htmlFor={specialty} className="text-sm">
                          {specialty}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">Reset</Button>
                  <SheetClose asChild>
                    <Button className="flex-1">Apply Filters</Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredHospitals.map(hospital => (
            <Card key={hospital.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <Image
                src={hospital.image || "/placeholder.svg"}
                alt={hospital.name}
                width={300}
                height={150}
                className="w-full h-40 object-cover"
              />
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{hospital.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{hospital.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Estimated wait: {hospital.waitTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {hospital.specialties.map(specialty => (
                    <Badge key={specialty} variant="outline">{specialty}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/hospitals/${hospital.id}`}>
                    <Button variant="outline" className="w-full">Details</Button>
                  </Link>
                  <Link href={`/hospitals/${hospital.id}/connect`}>
                    <Button className="w-full">Connect</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Hospital Services</h2>
            <Tabs defaultValue="emergency">
              <TabsList className="w-full">
                <TabsTrigger value="emergency" className="flex-1">Emergency</TabsTrigger>
                <TabsTrigger value="specialized" className="flex-1">Specialized Care</TabsTrigger>
                <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
              </TabsList>
              <TabsContent value="emergency" className="pt-4">
                <ul className="space-y-2">
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Trauma & Emergency Care</h3>
                      <p className="text-sm text-muted-foreground">Immediate life-saving treatment</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Urgent Care Services</h3>
                      <p className="text-sm text-muted-foreground">For non-life-threatening emergencies</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Critical Care Transport</h3>
                      <p className="text-sm text-muted-foreground">Hospital-to-hospital transfer services</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="specialized" className="pt-4">
                <ul className="space-y-2">
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Cardiac Care Center</h3>
                      <p className="text-sm text-muted-foreground">Advanced heart treatment and monitoring</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Neurology Department</h3>
                      <p className="text-sm text-muted-foreground">Brain and nervous system specialists</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Pediatric Emergency</h3>
                      <p className="text-sm text-muted-foreground">Specialized care for children</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="general" className="pt-4">
                <ul className="space-y-2">
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Outpatient Services</h3>
                      <p className="text-sm text-muted-foreground">Regular check-ups and consultations</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Laboratory & Diagnostics</h3>
                      <p className="text-sm text-muted-foreground">Testing and medical analysis</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                  <li className="p-3 bg-muted rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">Pharmacy Services</h3>
                      <p className="text-sm text-muted-foreground">Medication dispensing and counseling</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}