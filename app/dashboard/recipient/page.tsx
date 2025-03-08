"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ref, onValue, off } from "firebase/database";
import { database } from "@/lib/firebase";

import { Button } from "@/components/ui/button";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RecipientDashboardSummary } from "@/components/dashboard/recipient/dashboard-summary";
import LiveDonorMapSection from "@/components/dashboard/recipient/live-donor-map-section2";
import { RecipientDashboardTabs } from "@/components/dashboard/recipient/dashboard-tabs";

// Import the API functions
import {
  getAllBloodRequests,
  getHardcodedUserId,
  BloodRequest,
} from "@/lib/recipient_api";

// Import notification API functions
import {
  createAcceptedRequestNotification,
  Notification,
} from "@/lib/notification_api";
import DonorDashboardPage from "../donor/page";
import DonorNavigationMap from "@/components/dashboard/recipient/live-donor-map-section";

// Mock data for donors, inventory, and demand prediction remain the same
const mockDonors = [
  {
    id: "donor-001",
    name: "James Wilson",
    bloodType: "O+",
    lastDonation: "2023-02-15",
    location: { lat: 40.7128, lng: -74.006 },
    contactConsent: true,
    phone: "555-123-4567",
  },
];

const mockInventory = [
  { id: "inv-001", bloodType: "A+", quantity: 15, expiryDate: "2023-12-15" },
  { id: "inv-002", bloodType: "A-", quantity: 8, expiryDate: "2023-12-10" },
  { id: "inv-003", bloodType: "B+", quantity: 12, expiryDate: "2023-12-20" },
  { id: "inv-004", bloodType: "B-", quantity: 5, expiryDate: "2023-12-05" },
  { id: "inv-005", bloodType: "AB+", quantity: 7, expiryDate: "2023-12-18" },
  { id: "inv-006", bloodType: "AB-", quantity: 3, expiryDate: "2023-12-08" },
  { id: "inv-007", bloodType: "O+", quantity: 20, expiryDate: "2023-12-25" },
  { id: "inv-008", bloodType: "O-", quantity: 10, expiryDate: "2023-12-15" },
];

const mockDemandData = [
  { day: "Mon", "A+": 4, "B+": 3, "AB+": 2, "O+": 5, "A-": 2, "B-": 1, "AB-": 1, "O-": 3 },
  { day: "Tue", "A+": 5, "B+": 2, "AB+": 1, "O+": 6, "A-": 1, "B-": 1, "AB-": 0, "O-": 2 },
  { day: "Wed", "A+": 6, "B+": 4, "AB+": 2, "O+": 7, "A-": 3, "B-": 2, "AB-": 1, "O-": 4 },
  { day: "Thu", "A+": 4, "B+": 3, "AB+": 1, "O+": 5, "A-": 2, "B-": 1, "AB-": 1, "O-": 3 },
  { day: "Fri", "A+": 7, "B+": 5, "AB+": 3, "O+": 8, "A-": 4, "B-": 2, "AB-": 2, "O-": 5 },
  { day: "Sat", "A+": 8, "B+": 6, "AB+": 4, "O+": 10, "A-": 5, "B-": 3, "AB-": 2, "O-": 6 },
  { day: "Sun", "A+": 5, "B+": 4, "AB+": 2, "O+": 6, "A-": 3, "B-": 2, "AB-": 1, "O-": 4 },
]
// Convert database request to UI format
const mapRequestToUIFormat = (request: BloodRequest) => {
  return {
    id: request.id || "",
    patientName: request.fullName,
    bloodType: request.bloodType,
    quantity: 1, // Default to 1 unit
    urgencyLevel: request.urgencyLevel,
    hospital: request.hospitalName,
    requestDate: request.createdAt,
    status: request.status,
    acceptedBy: request.donorId ? "A donor" : undefined,
    estimatedArrival: request.donorId
      ? new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString()
      : undefined,
  };
};

// Track processed request IDs to avoid duplicate notifications
const processedRequests = new Set<string>();

export default function RecipientDashboardPage() {
  const [donorLocation, setDonorLocation] = useState({
    lat: 18.5308,
    lng: 73.8475,
  });

  // Example recipient location in Pune (Koregaon Park)
  const [recipientLocation, setRecipientLocation] = useState({
    lat: 18.5362,
    lng: 73.8961,
  });
  const [activeTab, setActiveTab] = useState<string>("inventory");
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false);

  // Manual implementation of request status listener
  useEffect(() => {
    const userId = getHardcodedUserId();
    const bloodRequestsRef = ref(database, "bloodRequests");

    // This function will be called whenever the blood requests data changes
    const handleDataChange = (snapshot: any) => {
      if (!snapshot.exists()) return;

      const requests = snapshot.val();

      for (const requestId in requests) {
        const request = requests[requestId];

        // Only process requests for the current user
        if (request.requesterId !== userId) continue;

        // Process accepted requests that haven't been processed yet
        if (
          request.status === "accepted" &&
          request.donorId &&
          !processedRequests.has(requestId)
        ) {
          // Mark as processed to avoid duplicate notifications
          processedRequests.add(requestId);

          // Create a notification for this request
          createAcceptedRequestNotification(requestId, userId, request.donorId)
            .then((notification) => {
              if (notification) {
                console.log("Notification created successfully:", notification);
              }
            })
            .catch((error) => {
              console.error("Error creating notification:", error);
            });
        }
      }
    };

    // Set up the listener
    onValue(bloodRequestsRef, handleDataChange);

    // Clean up
    return () => {
      off(bloodRequestsRef, "value", handleDataChange);
    };
  }, []);

  // Fetch active requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const userId = getHardcodedUserId();

        // Get all requests and filter for the current user
        const allRequests = await getAllBloodRequests();
        const userRequests = allRequests.filter(
          (request) => request.requesterId === userId
        );

        // Sort by creation date, newest first
        userRequests.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        // Update active requests state
        setActiveRequests(userRequests.map(mapRequestToUIFormat));

        // Check for any accepted requests that need notifications
        userRequests.forEach((request) => {
          if (
            request.status === "accepted" &&
            request.donorId &&
            !processedRequests.has(request.id || "")
          ) {
            // Mark as processed to avoid duplicate notifications
            if (request.id) {
              processedRequests.add(request.id);
            }

            // Create a notification for this request
            createAcceptedRequestNotification(
              request.id || "",
              userId,
              request.donorId
            )
              .then((notification) => {
                if (notification) {
                  console.log("Notification created on init:", notification);
                }
              })
              .catch((error) => {
                console.error("Error creating notification:", error);
              });
          }
        });
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();

    // Refresh every 30 seconds
    const intervalId = setInterval(fetchRequests, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1" onClick={(e) => e.stopPropagation()}>
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Recipient Dashboard</h1>
            <Button variant="outline" asChild>
              <Link href="/dashboard/donor">Switch to Donor View</Link>
            </Button>
          </div>

          <RecipientDashboardSummary
            inventory={mockInventory}
            activeRequests={activeRequests}
          />

          <div className="grid gap-6 mt-6 md:grid-cols-2">
          <LiveDonorMapSection 
  initialDonorLocation={{ lat: 18.6517288, lng:73.759064}} 
  recipientLocation={{ lat: 18.6499917, lng: 73.7793951 }} 
/>
            <RecipientDashboardTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              inventory={mockInventory}
              activeRequests={activeRequests}
              demandData={mockDemandData}
              showCreateRequestDialog={showCreateRequestDialog}
              setShowCreateRequestDialog={setShowCreateRequestDialog}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
