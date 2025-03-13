"use client"

import { useState } from "react"
<<<<<<< HEAD
import Link from "next/link"
import { Bell, Calendar, Droplet, Gift, Home, Share2, Trophy, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BadgeDisplay } from "@/components/badge-display"
import { SocialSharingComponent } from "@/components/social-sharing-component"
import { SponsorRewards } from "@/components/sponsor-rewards"
=======
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileOverviewTab } from "@/components/profile/tabs/overview-tab"
import { ProfileBadgesTab } from "@/components/profile/tabs/badges-tab"
import { ProfileRewardsTab } from "@/components/profile/tabs/rewards-tab"
import { ProfileHealthTab } from "@/components/profile/tabs/health-tab"
import { SocialSharingComponent } from "@/components/social-sharing-component"
>>>>>>> ashish

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
<<<<<<< HEAD
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
=======
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
>>>>>>> ashish
  const [showSocialSharing, setShowSocialSharing] = useState(false)

  const earnedBadges = donorProfile.badges.filter((badge) => badge.earned)
  const inProgressBadges = donorProfile.badges.filter((badge) => !badge.earned)
  const availableRewards = donorProfile.rewards.filter((reward) => !reward.redeemed)
  const redeemedRewards = donorProfile.rewards.filter((reward) => reward.redeemed)

  return (
    <div className="flex min-h-screen flex-col">
<<<<<<< HEAD
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
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </nav>
        </div>
      </header>
=======
      <ProfileHeader />
>>>>>>> ashish

      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col gap-6 md:flex-row">
<<<<<<< HEAD
            <div className="md:w-1/3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{donorProfile.name}</CardTitle>
                      <CardDescription>{donorProfile.email}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Blood Type: {donorProfile.bloodType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Donations</span>
                      <span className="font-semibold">{donorProfile.totalDonations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Points</span>
                      <span className="font-semibold">{donorProfile.points}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Donation</span>
                      <span className="font-semibold">{new Date(donorProfile.lastDonation).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="font-semibold">{new Date(donorProfile.joinedDate).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Progress to Next Badge</span>
                        <span className="text-sm font-medium">
                          {donorProfile.points}/{donorProfile.nextBadgePoints}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(100, (donorProfile.points / donorProfile.nextBadgePoints) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setShowSocialSharing(true)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Your Impact
                  </Button>
                </CardFooter>
              </Card>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-primary" />
                  Latest Achievements
                </h3>
                <div className="space-y-3">
                  {donorProfile.achievements.slice(0, 3).map((achievement) => (
                    <Card key={achievement.id}>
                      <CardHeader className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{achievement.title}</CardTitle>
                            <CardDescription className="text-xs">{achievement.description}</CardDescription>
                          </div>
                          <Badge variant="secondary">+{achievement.points} pts</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                  <Button variant="link" className="w-full" asChild>
                    <Link href="/profile?tab=achievements">View All Achievements</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="badges">Badges</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 pt-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Trophy className="mr-2 h-5 w-5 text-primary" />
                          Recent Badges
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {earnedBadges.slice(0, 4).map((badge) => (
                            <div
                              key={badge.id}
                              className="flex flex-col items-center p-2 rounded-lg border bg-card text-card-foreground shadow-sm"
                            >
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center bg-${badge.color}-100 text-${badge.color}-500 mb-2`}
                              >
                                <Droplet className="h-6 w-6" />
                              </div>
                              <span className="text-sm font-medium text-center">{badge.name}</span>
                            </div>
                          ))}
                        </div>
                        <Button variant="link" className="w-full mt-2" onClick={() => setActiveTab("badges")}>
                          View All Badges
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Gift className="mr-2 h-5 w-5 text-primary" />
                          Available Rewards
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {availableRewards.slice(0, 2).map((reward) => (
                            <div key={reward.id} className="flex items-center p-3 rounded-lg border">
                              <img
                                src={reward.image || "/placeholder.svg"}
                                alt={reward.sponsor}
                                className="w-16 h-12 object-contain mr-3"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{reward.title}</h4>
                                <p className="text-xs text-muted-foreground">{reward.sponsor}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="link" className="w-full mt-2" onClick={() => setActiveTab("rewards")}>
                          View All Rewards
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Donation History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>
                        <div className="space-y-6">
                          {donorProfile.achievements.map((achievement, index) => (
                            <div key={achievement.id} className="relative pl-8">
                              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                                {donorProfile.achievements.length - index}
                              </div>
                              <div>
                                <h4 className="font-medium">{achievement.title}</h4>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(achievement.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="badges" className="pt-4">
                  <BadgeDisplay earnedBadges={earnedBadges} inProgressBadges={inProgressBadges} />
                </TabsContent>

                <TabsContent value="rewards" className="pt-4">
                  <SponsorRewards availableRewards={availableRewards} redeemedRewards={redeemedRewards} />
=======
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
>>>>>>> ashish
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

