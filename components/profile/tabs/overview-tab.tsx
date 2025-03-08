"use client"
import { Droplet, Gift, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CurrentDonationStatus } from "@/components/current-donation-status"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earned: boolean
  earnedDate?: string
}

interface Reward {
  id: string
  sponsor: string
  title: string
  description: string
  expiryDate: string
  code: string
  redeemed: boolean
  image: string
}

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  points: number
}

interface ActiveDonation {
  id: string
  patientName: string
  hospitalName: string
  bloodType: string
  donationDate: string
  status: string
  eta: string
  stages: {
    name: string
    completed: boolean
    timestamp?: string
    estimatedTime?: string
  }[]
}

interface ProfileOverviewTabProps {
  earnedBadges: Badge[]
  availableRewards: Reward[]
  achievements: Achievement[]
  activeDonation: ActiveDonation
  onViewAllBadges: () => void
  onViewAllRewards: () => void
}

export function ProfileOverviewTab({
  earnedBadges,
  availableRewards,
  achievements,
  activeDonation,
  onViewAllBadges,
  onViewAllRewards,
}: ProfileOverviewTabProps) {
  return (
    <div className="space-y-6">
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
            <Button variant="link" className="w-full mt-2" onClick={onViewAllBadges}>
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
            <Button variant="link" className="w-full mt-2" onClick={onViewAllRewards}>
              View All Rewards
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DonationHistoryCard achievements={achievements} />
        <CurrentDonationStatus activeDonation={activeDonation} />
      </div>
    </div>
  )
}

function DonationHistoryCard({ achievements }: { achievements: Achievement[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                  {achievements.length - index}
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
  )
}

