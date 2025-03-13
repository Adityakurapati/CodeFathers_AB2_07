"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileOverviewTab } from "@/components/profile/tabs/overview-tab"
import { ProfileBadgesTab } from "@/components/profile/tabs/badges-tab"
import { ProfileRewardsTab } from "@/components/profile/tabs/rewards-tab"
import { ProfileHealthTab } from "@/components/profile/tabs/health-tab"
import { SocialSharingComponent } from "@/components/social-sharing-component"

// Mock data for demonstration
const donorProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  bloodType: "O+",
  totalDonations: 5,
  points: 750,
  nextBadgePoints: 1000,
  lastDonation: "2023-02-15",
  joinedDate: "2022-10-01",
  badges: [
    {
      id: "first-time",
      name: "First-Time Donor",
      description: "Completed your first blood donation",
      icon: "droplet",
      color: "blue",
      earned: true,
      earnedDate: "2022-10-15",
    },
    {
      id: "regular",
      name: "Regular Donor",
      description: "Donated blood 3 times",
      icon: "heart",
      color: "red",
      earned: true,
      earnedDate: "2023-01-10",
    },
    {
      id: "lifesaver",
      name: "Lifesaver",
      description: "Donated blood 5 times",
      icon: "award",
      color: "gold",
      earned: true,
      earnedDate: "2023-02-15",
    },
    {
      id: "blood-warrior",
      name: "Blood Warrior",
      description: "Donated blood 10 times",
      icon: "shield",
      color: "purple",
      earned: false,
      progress: 50, // percentage
    },
    {
      id: "blood-champion",
      name: "Blood Champion",
      description: "Donated blood 20 times",
      icon: "trophy",
      color: "emerald",
      earned: false,
      progress: 25, // percentage
    },
  ],
  rewards: [
    {
      id: "reward-001",
      sponsor: "Health Café",
      title: "Free Smoothie",
      description: "Enjoy a free smoothie after your donation",
      expiryDate: "2023-04-15",
      code: "HEALTHCAFE123",
      redeemed: false,
      image: "/placeholder.svg?height=80&width=200",
    },
    {
      id: "reward-002",
      sponsor: "Fitness First",
      title: "25% Off Monthly Membership",
      description: "Get 25% off your next month's membership",
      expiryDate: "2023-05-01",
      code: "FIT25OFF",
      redeemed: false,
      image: "/placeholder.svg?height=80&width=200",
    },
    {
      id: "reward-003",
      sponsor: "BookWorld",
      title: "Buy 1 Get 1 Free",
      description: "Buy any book and get one free of equal or lesser value",
      expiryDate: "2023-04-30",
      code: "BOOKB1G1",
      redeemed: true,
      image: "/placeholder.svg?height=80&width=200",
    },
  ],
  achievements: [
    {
      id: "achievement-001",
      title: "First Donation",
      description: "Completed your first blood donation",
      date: "2022-10-15",
      points: 100,
    },
    {
      id: "achievement-002",
      title: "Quick Response",
      description: "Responded to an emergency request within 2 hours",
      date: "2022-12-05",
      points: 150,
    },
    {
      id: "achievement-003",
      title: "Regular Donor",
      description: "Donated blood 3 times",
      date: "2023-01-10",
      points: 200,
    },
    {
      id: "achievement-004",
      title: "Lifesaver",
      description: "Donated blood 5 times",
      date: "2023-02-15",
      points: 300,
    },
  ],
  // Mock active donation data
  activeDonation: {
    id: "donation-005",
    patientName: "Emily Wilson",
    hospitalName: "ABC Hospital",
    bloodType: "O+",
    donationDate: "2023-03-07",
    status: "transported",
    eta: "2 hours",
    stages: [
      { name: "Matched", completed: true, timestamp: "2023-03-07T09:30:00" },
      { name: "Collected", completed: true, timestamp: "2023-03-07T10:15:00" },
      { name: "Transported", completed: true, timestamp: "2023-03-07T11:00:00" },
      { name: "Delivered", completed: false, estimatedTime: "2023-03-07T13:00:00" },
    ],
  },
  // Mock health data
  healthData: {
    lastTestDate: "2023-02-10",
    bloodPressure: "120/80",
    hemoglobin: 14.2,
    ironLevel: 95,
    cholesterol: {
      total: 180,
      hdl: 60,
      ldl: 100,
    },
    bloodSugar: 85,
    reports: [
      { id: "report-001", name: "Complete Blood Count", date: "2023-02-10", fileUrl: "#" },
      { id: "report-002", name: "Lipid Profile", date: "2023-01-15", fileUrl: "#" },
      { id: "report-003", name: "Iron Studies", date: "2022-11-20", fileUrl: "#" },
    ],
  },
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [showSocialSharing, setShowSocialSharing] = useState(false)

  const earnedBadges = donorProfile.badges.filter((badge) => badge.earned)
  const inProgressBadges = donorProfile.badges.filter((badge) => !badge.earned)
  const availableRewards = donorProfile.rewards.filter((reward) => !reward.redeemed)
  const redeemedRewards = donorProfile.rewards.filter((reward) => reward.redeemed)

  return (
    <div className="flex min-h-screen flex-col">
      <ProfileHeader />

      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <ProfileSidebar profile={donorProfile} onShareClick={() => setShowSocialSharing(true)} />

            <div className="md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="badges">Badges</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  <TabsTrigger value="health">Health Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 pt-4">
                  <ProfileOverviewTab
                    earnedBadges={earnedBadges}
                    availableRewards={availableRewards}
                    achievements={donorProfile.achievements}
                    activeDonation={donorProfile.activeDonation}
                    onViewAllBadges={() => setActiveTab("badges")}
                    onViewAllRewards={() => setActiveTab("rewards")}
                  />
                </TabsContent>

                <TabsContent value="badges" className="pt-4">
                  <ProfileBadgesTab earnedBadges={earnedBadges} inProgressBadges={inProgressBadges} />
                </TabsContent>

                <TabsContent value="rewards" className="pt-4">
                  <ProfileRewardsTab availableRewards={availableRewards} redeemedRewards={redeemedRewards} />
                </TabsContent>

                <TabsContent value="health" className="pt-4">
                  <ProfileHealthTab healthData={donorProfile.healthData} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {showSocialSharing && <SocialSharingComponent donor={donorProfile} onClose={() => setShowSocialSharing(false)} />}
    </div>
  )
}

