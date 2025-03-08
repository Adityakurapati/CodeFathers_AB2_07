"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Clock,
  Navigation,
  Phone,
  MessageSquare,
  Check,
  Home,
  Calendar,
  Award,
  User,
  Settings,
  Heart,
  Droplet,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// import dynamic from "next/dynamic";

// // Ensure the path is correct and `ssr: false` is used
// const DonorNavigationMapDynamic = dynamic(() => import("@/components/map-wrapper"), {
//   ssr: false,
// });

import { DonorNavigationMapDynamic } from "@/components/map-wrapper"
import { getBloodRequests, getCampaigns, registerForCampaign } from "@/lib/api"
import type { BloodRequest, Campaign } from "@/lib/types"
import { formatTimeAgo, formatUrgencyLevel, getUrgencyColor, formatDate, calculateProgress } from "@/lib/utils"
import { auth } from "@/lib/firebase"
import { motion } from "framer-motion"

export default function DonorView() {
  const router = useRouter()
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null)
  const [donorLocation, setDonorLocation] = useState({ lat: null, lng: null })
  const [isLoading, setIsLoading] = useState(true)
  const [activePage, setActivePage] = useState("requests")
  const [userId, setUserId] = useState<string | null>(null)
  const [pulsatingEffect, setPulsatingEffect] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  }

  useEffect(() => {
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        // Redirect to login if not authenticated
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setDonorLocation(userLocation)

          // Fetch data once we have the location
          if (userId) {
            fetchData(userLocation)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to a location
          const defaultLocation = { lat: 40.7128, lng: -74.006 }
          setDonorLocation(defaultLocation)

          // Fetch data with default location
          if (userId) {
            fetchData(defaultLocation)
          }
        },
      )
    }
  }, [userId])

  // Animation for progress bars
  useEffect(() => {
    if (!isLoading) {
      const animateProgress = setInterval(() => {
        setProgressValue(prev => {
          if (prev < 100) return prev + 1;
          clearInterval(animateProgress);
          return 100;
        });
      }, 15);
      
      return () => clearInterval(animateProgress);
    }
  }, [isLoading]);

  // Pulsating effect for urgent requests
  useEffect(() => {
    const pulsatingInterval = setInterval(() => {
      setPulsatingEffect(prev => !prev);
    }, 1000);
    
    return () => clearInterval(pulsatingInterval);
  }, []);

  // Filter requests based on search
  useEffect(() => {
    if (searchInput) {
      const filtered = bloodRequests.filter(request => 
        request.fullName.toLowerCase().includes(searchInput.toLowerCase()) ||
        request.bloodType.toLowerCase().includes(searchInput.toLowerCase()) ||
        request.hospitalName?.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(bloodRequests);
    }
  }, [searchInput, bloodRequests]);

  const fetchData = async (location: { lat: number; lng: number }) => {
    setIsLoading(true)
    try {
      // Fetch blood requests and campaigns in parallel
      const [requestsData, campaignsData] = await Promise.all([getBloodRequests(location), getCampaigns(location)])

      setBloodRequests(requestsData)
      setFilteredRequests(requestsData)
      setCampaigns(campaignsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestClick = (request: BloodRequest) => {
    // Add animation effect when selecting a request
    setSelectedRequest(null);
    setTimeout(() => {
      setSelectedRequest(request);
    }, 300);
  }

  const handleAcceptRequest = async (requestId: string) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to accept requests.",
      })
      return
    }

    try {
      // Navigate to qualification page with request ID
      toast({
        title: "Processing your request",
        description: "Please wait...",
      })
      
      setTimeout(() => {
        router.push(`/donor-qualification/${requestId}`)
      }, 1000)
    } catch (error) {
      console.error("Error accepting request:", error)
      toast({
        variant: "destructive",
        title: "Error accepting request",
        description: "Please try again later.",
      })
    }
  }

  const handleRegisterForCampaign = async (campaignId: string) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to register for campaigns.",
      })
      return
    }

    try {
      await registerForCampaign(campaignId, userId)

      // Update local state to reflect registration
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === campaignId
            ? {
                ...campaign,
                registeredDonors: (campaign.registeredDonors || 0) + 1,
                isRegistered: true,
              }
            : campaign,
        ),
      )

      toast({
        title: "Registration successful!",
        description: "You have been registered for this campaign.",
      })
    } catch (error) {
      console.error("Error registering for campaign:", error)
      toast({
        variant: "destructive",
        title: "Error registering",
        description: "Please try again later.",
      })
    }
  }

  const renderPageContent = () => {
    switch (activePage) {
      case "requests":
        return renderRequestsPage()
      case "campaigns":
        return renderCampaignsPage()
      default:
        return renderRequestsPage()
    }
  }

  const renderRequestsPage = () => {
    return (
      <motion.div 
        className="grid gap-8 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Blood Requests List */}
        <Card className="overflow-hidden border-red-100 shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-red-600">
                  <Droplet className="mr-2 h-5 w-5" />
                  Blood Requests  
                </CardTitle>
                <CardDescription>View and respond to blood requests in your area</CardDescription>
              </div>
              <Badge className="animate-pulse bg-red-600">
                {bloodRequests.filter(req => req.urgencyLevel === "immediate").length} Urgent
              </Badge>
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Search by name, blood type, or hospital..."
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4 grid mt-4  w-full grid-cols-3">
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="urgent" className="relative">
                Heroic Donor
                  {pulsatingEffect && 
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                  }
                </TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p>No blood requests available at this time.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        variants={itemVariants}
                        className={`group  mb-6 cursor-pointer overflow-hidden rounded-lg border p-4 transition-all duration-300 hover:bg-red-50 hover:shadow-md ${
                          selectedRequest?.id === request.id ? "border-red-400 bg-red-50/70 shadow-md" : ""
                        }`}
                        onClick={() => handleRequestClick(request)}
                        whileHover={{ y: -4 }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium group-hover:text-red-600">{request.fullName}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="flex items-center gap-1 font-bold text-red-600">
                                <Droplet className="h-3 w-3" />
                                {request.bloodType}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.distance} km
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(request.createdAt)}
                              </span>
                            </div>
                            <div className="mt-2">
                              <Badge 
                                className={`${getUrgencyColor(request.urgencyLevel)} ${
                                  request.urgencyLevel === "immediate" ? "animate-pulse" : ""
                                } text-white`}
                              >
                                {formatUrgencyLevel(request.urgencyLevel)}
                              </Badge>
                            </div>
                          </div>
                          {request.status === "pending" ? (
                            <Button
                              size="sm"
                              className="bg-red-600 transition-all duration-300 hover:bg-red-700 hover:shadow-md"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAcceptRequest(request.id)
                              }}
                            >
                              <Heart className="mr-1 h-3 w-3" /> Accept
                            </Button>
                          ) : (
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              <Check className="mr-1 h-3 w-3" /> Accepted
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="urgent" className="space-y-4">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredRequests
                    .filter((req) => req.urgencyLevel === "immediate" || req.urgencyLevel === "within12Hours")
                    .map((request) => (
                      <motion.div
                        key={request.id}
                        variants={itemVariants}
                        className={`group mb-6 cursor-pointer overflow-hidden rounded-lg border p-4 transition-all duration-300 hover:bg-red-50 hover:shadow-md ${
                          request.urgencyLevel === "immediate" ? "border-red-300" : ""
                        } ${selectedRequest?.id === request.id ? "border-red-400 bg-red-50/70" : ""}`}
                        onClick={() => handleRequestClick(request)}
                        whileHover={{ y: -4 }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium group-hover:text-red-600">{request.fullName}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="flex items-center gap-1 font-bold text-red-600">
                                <Droplet className="h-3 w-3" />
                                {request.bloodType}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.distance} km
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(request.createdAt)}
                              </span>
                            </div>
                            <div className="mt-2">
                              <Badge 
                                className={`${getUrgencyColor(request.urgencyLevel)} ${
                                  request.urgencyLevel === "immediate" ? "animate-pulse" : ""
                                } text-white`}
                              >
                                {formatUrgencyLevel(request.urgencyLevel)}
                              </Badge>
                            </div>
                          </div>
                          {request.status === "pending" ? (
                            <Button
                              size="sm"
                              className="bg-red-600 transition-all duration-300 hover:bg-red-700 hover:shadow-md"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAcceptRequest(request.id)
                              }}
                            >
                              <Heart className="mr-1 h-3 w-3" /> Accept
                            </Button>
                          ) : (
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              <Check className="mr-1 h-3 w-3" /> Accepted
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="accepted" className="space-y-4">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredRequests
                    .filter((req) => req.status === "accepted")
                    .map((request) => (
                      <motion.div
                        key={request.id}
                        variants={itemVariants}
                        className={`group mb-6 cursor-pointer rounded-lg border border-green-100 bg-green-50/30 p-4 transition-all duration-300 hover:bg-green-50 hover:shadow-md ${
                          selectedRequest?.id === request.id ? "border-green-300 bg-green-50/70 shadow-md" : ""
                        }`}
                        onClick={() => handleRequestClick(request)}
                        whileHover={{ y: -4 }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium group-hover:text-green-600">{request.fullName}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="flex items-center gap-1 font-bold text-red-600">
                                <Droplet className="h-3 w-3" />
                                {request.bloodType}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.distance} km
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(request.createdAt)}
                              </span>
                            </div>
                            <div className="mt-2">
                              <Badge className={`${getUrgencyColor(request.urgencyLevel)} text-white`}>
                                {formatUrgencyLevel(request.urgencyLevel)}
                              </Badge>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            <Check className="mr-1 h-3 w-3" /> Accepted
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Navigation Map & Details */}
        <div className="flex flex-col space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="flex-1 overflow-hidden border-red-100 shadow-lg transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-white">
                <CardTitle className="flex items-center text-red-600">
                  <Navigation className="mr-2 h-5 w-5" />
                  Navigation Map
                </CardTitle>
                <CardDescription>
                  {selectedRequest
                    ? `Route to ${selectedRequest.fullName}'s location`
                    : "Select a request to view navigation route"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="h-[400px] w-full overflow-hidden">
                  {donorLocation.lat && donorLocation.lng ? (
                    <DonorNavigationMapDynamic
                      donorLocation={donorLocation}
                      recipientLocation={selectedRequest?.location}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Selected Request Details */}
          {selectedRequest && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-red-100 shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-gradient-to-r from-red-50 to-white">
                  <CardTitle className="flex items-center text-red-600">
                    <User className="mr-2 h-5 w-5" />
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        className="rounded-lg bg-red-50/50 p-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="text-sm text-muted-foreground">Recipient</p>
                        <p className="font-medium">{selectedRequest.fullName}</p>
                      </motion.div>
                      <motion.div 
                        className="rounded-lg bg-red-50/50 p-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                        <p className="font-medium text-red-600">{selectedRequest.bloodType}</p>
                      </motion.div>
                      <motion.div 
                        className="rounded-lg bg-red-50/50 p-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium">{selectedRequest.contactNumber}</p>
                      </motion.div>
                      <motion.div 
                        className="rounded-lg bg-red-50/50 p-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-sm text-muted-foreground">Hospital</p>
                        <p className="font-medium">{selectedRequest.hospitalName || "Not specified"}</p>
                      </motion.div>
                      <motion.div 
                        className="rounded-lg bg-red-50/50 p-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <p className="font-medium capitalize">{selectedRequest.reason}</p>
                      </motion.div>
                      <motion.div 
                        className="rounded-lg bg-red-50/50 p-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-sm text-muted-foreground">Urgency</p>
                        <p className={`font-medium ${selectedRequest.urgencyLevel === "immediate" ? "text-red-600" : ""}`}>
                          {formatUrgencyLevel(selectedRequest.urgencyLevel)}
                        </p>
                      </motion.div>
                      {selectedRequest.address && (
                        <motion.div 
                          className="col-span-2 rounded-lg bg-red-50/50 p-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium">{selectedRequest.address}</p>
                        </motion.div>
                      )}
                    </div>

                    <motion.div 
                      className="flex space-x-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button 
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300 hover:shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 hover:shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 transition-all duration-300 hover:shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Navigate
                      </Button>
                    </motion.div>

                    {selectedRequest.status === "accepted" && (
                      <motion.div 
                        className="mt-4 space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <p className="font-medium">Update Status:</p>
                        <Button 
                          className="w-full bg-gradient-to-r from-green-600 to-green-500 transition-all duration-300 hover:shadow-md"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  const renderCampaignsPage = () => {
    return (
      <div className="flex flex-col p-6 bg-gradient-to-br from-red-50 to-white min-h-screen">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Blood Donation Campaigns & Events</h1>
          <p className="text-gray-600">Upcoming blood drives and donation events in your area</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl border-l-4 border-red-500"
            >
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{campaign.organizer}</p>
                
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{formatDate(campaign.date)}</p>
                    <p className="text-sm text-gray-600">{campaign.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    {campaign.location} <span className="text-sm text-red-600 font-medium">({campaign.distance} km)</span>
                  </p>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">{campaign.description}</p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Blood Types Needed:</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.bloodTypesNeeded.map((type) => (
                      <span 
                        key={type} 
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium animate-pulse"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                {campaign.registeredDonors !== undefined && campaign.targetDonors && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Registration Progress</h3>
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-red-300 to-red-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                            style={{ width: `${(campaign.registeredDonors / campaign.targetDonors) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {campaign.registeredDonors}/{campaign.targetDonors}
                      </span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => handleRegisterForCampaign(campaign.id)}
                  disabled={campaign.isRegistered}
                  className={`w-full py-3 rounded-md font-medium transition-all duration-300 ${
                    campaign.isRegistered 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700 transform hover:-translate-y-1 shadow-md hover:shadow-lg'
                  }`}
                >
                  {campaign.isRegistered ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Already Registered
                    </span>
                  ) : (
                    "Register to Donate"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-16 flex-shrink-0 bg-white shadow-md md:w-64">
        <div className="flex h-16 items-center justify-center border-b">
          <h2 className="hidden text-xl font-bold text-red-600 md:block">BloodConnect</h2>
          <Badge className="md:hidden bg-red-600">BL</Badge>
        </div>
        <nav className="flex flex-col gap-2 p-2">
          <Button
            variant={activePage === "requests" ? "default" : "ghost"}
            className={`justify-start ${activePage === "requests" ? "bg-red-600 hover:bg-red-700" : ""}`}
            onClick={() => setActivePage("requests")}
          >
            <Home className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Blood Requests</span>
          </Button>
          <Button
            variant={activePage === "campaigns" ? "default" : "ghost"}
            className={`justify-start ${activePage === "campaigns" ? "bg-red-600 hover:bg-red-700" : ""}`}
            onClick={() => setActivePage("campaigns")}
          >
            <Calendar className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Campaigns & Events</span>
          </Button>
          <Button variant="ghost" className="justify-start">
            <Award className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">My Donations</span>
          </Button>
          <Button
      variant="ghost"
      className="justify-start"
      onClick={() => router.push("/profile")}
    >
      <User className="h-5 w-5 md:mr-2" />
      <span className="hidden md:inline">Profile</span>
    </Button>
        </nav>
        <div className="absolute bottom-0 w-full border-t p-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-16 md:pl-64">
        <div className="container p-8">{renderPageContent()}</div>
      </div>
      <Toaster />
    </div>
  )
}

