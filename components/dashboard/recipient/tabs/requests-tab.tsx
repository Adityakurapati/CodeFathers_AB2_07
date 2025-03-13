"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,DialogOverlay
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

import { 
  BloodRequest, 
  createBloodRequest, 
  getCurrentUserBloodRequests, 
  updateBloodRequest,
  deleteBloodRequest,
  getUrgencyLevelLabel,
  getUrgencyValue,
  getHardcodedUserId,
  getDummyLocation
} from "@/lib/recipient_api"

interface RequestsTabProps {
  showCreateRequestDialog: boolean
  setShowCreateRequestDialog: (show: boolean) => void
}

// Convert database request to UI format
const mapRequestToUIFormat = (request: BloodRequest) => {
  return {
    id: request.id || "",
    patientName: request.fullName,
    bloodType: request.bloodType,
    quantity: 1, // Default to 1 unit
    urgencyLevel: getUrgencyValue(getUrgencyLevelLabel(request.urgencyLevel)),
    hospital: request.hospitalName,
    requestDate: request.createdAt,
    status: request.status,
    address: request.address,
    contactNumber: request.contactNumber,
    reason: request.reason,
    acceptedBy: request.donorId ? "A donor" : undefined,
    estimatedArrival: request.donorId 
      ? new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString() 
      : undefined
  }
}

export function RequestsTab({ showCreateRequestDialog, setShowCreateRequestDialog }: RequestsTabProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeRequests, setActiveRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  
  // Form state
  const [patientName, setPatientName] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [hospital, setHospital] = useState("")
  const [urgencyLevel, setUrgencyLevel] = useState("")
  const [notes, setNotes] = useState("")
  const [address, setAddress] = useState("")
  const [contactNumber, setContactNumber] = useState("")

  // Load requests
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true)
        // Using hardcoded user ID (for demo purposes)
        const userId = getHardcodedUserId()
        const requests = await getCurrentUserBloodRequests(userId)
        setActiveRequests(requests.map(mapRequestToUIFormat))
      } catch (error) {
        console.error("Error loading requests:", error)
        toast({
          title: "Error loading requests",
          description: "There was a problem loading your blood requests.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadRequests()
  }, [toast])

  const handleCreateRequest = async () => {
    if (!patientName || !bloodType || !hospital || !urgencyLevel || !address || !contactNumber) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Map UI urgency levels to database values
      const dbUrgencyLevel = (() => {
        switch (urgencyLevel) {
          case "critical": return "immediate"
          case "high": return "within12Hours"
          case "medium": return "within24Hours"
          default: return "within48Hours"
        }
      })()
      
      // Using hardcoded user ID (for demo purposes)
      const userId = getHardcodedUserId()
      
      // Create the request in Firebase
      const newRequest = await createBloodRequest({
        fullName: patientName,
        bloodType,
        hospitalName: hospital,
        urgencyLevel: dbUrgencyLevel,
        reason: notes || "Not specified",
        requesterId: userId,
        address,
        status: "pending",
        contactNumber,
        location: getDummyLocation()
      })
      
      // Add the new request to the UI
      setActiveRequests(prev => [
        mapRequestToUIFormat(newRequest as BloodRequest),
        ...prev
      ])
      
      // Reset form
      resetForm()
      
      toast({
        title: "Request created",
        description: "Your blood request has been created successfully.",
      })
      
      setShowCreateRequestDialog(false)
    } catch (error) {
      console.error("Error creating request:", error)
      toast({
        title: "Error creating request",
        description: "There was a problem creating your blood request.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteBloodRequest(id)
      setActiveRequests(prev => prev.filter(req => req.id !== id))
      toast({
        title: "Request deleted",
        description: "Your blood request has been deleted successfully.",
      })
      setConfirmDeleteId(null)
    } catch (error) {
      console.error("Error deleting request:", error)
      toast({
        title: "Error deleting request",
        description: "There was a problem deleting your blood request.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setPatientName("")
    setBloodType("")
    setHospital("")
    setUrgencyLevel("")
    setNotes("")
    setAddress("")
    setContactNumber("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Accepted</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
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
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Request Manager</h2>
        <Dialog open={showCreateRequestDialog} onOpenChange={setShowCreateRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
          {/* <DialogOverlay className="bg-transparent" /> */}

            <DialogHeader>
              <DialogTitle>Create Blood Request</DialogTitle>
              <DialogDescription>
                Fill out the details to create a new blood request and alert nearby donors.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="patient-name">Patient Name</Label>
                  <Input 
                    id="patient-name" 
                    placeholder="Enter patient name" 
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="request-blood-type">Blood Type</Label>
                  <Select onValueChange={setBloodType} value={bloodType}>
                    <SelectTrigger id="request-blood-type">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact-number">Contact Number</Label>
                  <Input 
                    id="contact-number" 
                    placeholder="Enter contact number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="urgency-level">Urgency Level</Label>
                  <Select onValueChange={setUrgencyLevel} value={urgencyLevel}>
                    <SelectTrigger id="urgency-level">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hospital">Hospital</Label>
                <Input 
                  id="hospital" 
                  placeholder="Enter hospital name"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="request-notes">Reason/Additional Notes</Label>
                <Textarea 
                  id="request-notes" 
                  placeholder="Enter reason for request or any additional information"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateRequestDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRequest} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blood request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmDeleteId && handleDeleteRequest(confirmDeleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : activeRequests.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No active blood requests. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {activeRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{request.patientName}</CardTitle>
                    <CardDescription>{request.hospital}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {request.bloodType}
                    </Badge>
                    {getUrgencyBadge(request.urgencyLevel)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                {request.status === "accepted" && (
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">Accepted by:</span> {request.acceptedBy}
                    </p>
                    <p>
                      <span className="font-medium">ETA:</span> {new Date(request.estimatedArrival).toLocaleTimeString()}
                    </p>
                  </div>
                )}
                <div className="mt-2 text-sm">
                  <p>
                    <span className="font-medium">Contact:</span> {request.contactNumber}
                  </p>
                  <p>
                    <span className="font-medium">Reason:</span> {request.reason}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {request.status === "pending" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setConfirmDeleteId(request.id)}
                  >
                    Cancel Request
                  </Button>
                )}
                <Button 
                  size="sm"
                  onClick={() => {
                    
                    sessionStorage.setItem('selected',`true`)
                    // View details functionality
                    toast({
                      title: "Request Details",
                      description: `Showing details for ${request.patientName}'s request`
                    });
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}