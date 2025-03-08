"use client"

import { Share2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileSidebarProps {
  profile: {
    name: string
    email: string
    bloodType: string
    totalDonations: number
    points: number
    nextBadgePoints: number
    lastDonation: string
    joinedDate: string
    achievements: {
      id: string
      title: string
      description: string
      date: string
      points: number
    }[]
  }
  onShareClick: () => void
}

export function ProfileSidebar({ profile, onShareClick }: ProfileSidebarProps) {
  return (
    <div className="md:w-1/3">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Blood Type: {profile.bloodType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Donations</span>
              <span className="font-semibold">{profile.totalDonations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Points</span>
              <span className="font-semibold">{profile.points}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Donation</span>
              <span className="font-semibold">{new Date(profile.lastDonation).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="font-semibold">{new Date(profile.joinedDate).toLocaleDateString()}</span>
            </div>

            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Progress to Next Badge</span>
                <span className="text-sm font-medium">
                  {profile.points}/{profile.nextBadgePoints}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (profile.points / profile.nextBadgePoints) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onShareClick}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Your Impact
          </Button>
        </CardFooter>
      </Card>

      <ProfileRecentAchievements achievements={profile.achievements} />
    </div>
  )
}

function ProfileRecentAchievements({
  achievements,
}: {
  achievements: { id: string; title: string; description: string; date: string; points: number }[]
}) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Trophy className="mr-2 h-5 w-5 text-primary" />
        Latest Achievements
      </h3>
      <div className="space-y-3">
        {achievements.slice(0, 3).map((achievement) => (
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
  )
}

// Import Trophy icon at the top of the file
import { Trophy } from "lucide-react"
import Link from "next/link"

