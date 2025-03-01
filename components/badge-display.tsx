"use client"

import { useState } from "react"
import { Award, CheckCircle, Droplet, Heart, Info, Shield, Trophy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BadgeType {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earned: boolean
  earnedDate?: string
  progress?: number
}

interface BadgeDisplayProps {
  earnedBadges: BadgeType[]
  inProgressBadges: BadgeType[]
}

export function BadgeDisplay({ earnedBadges, inProgressBadges }: BadgeDisplayProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null)

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "droplet":
        return <Droplet className="h-6 w-6" />
      case "heart":
        return <Heart className="h-6 w-6" />
      case "award":
        return <Award className="h-6 w-6" />
      case "shield":
        return <Shield className="h-6 w-6" />
      case "trophy":
        return <Trophy className="h-6 w-6" />
      default:
        return <Droplet className="h-6 w-6" />
    }
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-500 border-blue-200"
      case "red":
        return "bg-red-100 text-red-500 border-red-200"
      case "gold":
        return "bg-amber-100 text-amber-500 border-amber-200"
      case "purple":
        return "bg-purple-100 text-purple-500 border-purple-200"
      case "emerald":
        return "bg-emerald-100 text-emerald-500 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-500 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="earned">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="earned">Earned Badges ({earnedBadges.length})</TabsTrigger>
          <TabsTrigger value="progress">In Progress ({inProgressBadges.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="pt-4">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {earnedBadges.map((badge) => (
              <Dialog key={badge.id}>
                <DialogTrigger asChild>
                  <Card
                    className="cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <CardHeader className="pb-2 text-center">
                      <div
                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${getColorClass(badge.color)} mb-2`}
                      >
                        {getIconComponent(badge.icon)}
                      </div>
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-2">
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-center pt-0">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Earned on {new Date(badge.earnedDate || "").toLocaleDateString()}
                      </Badge>
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">{badge.name}</DialogTitle>
                    <DialogDescription className="text-center">{badge.description}</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center py-4">
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center ${getColorClass(badge.color)} mb-4`}
                    >
                      {getIconComponent(badge.icon)}
                    </div>
                    <p className="text-center mb-2">
                      You earned this badge on {new Date(badge.earnedDate || "").toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Unlocked
                    </Badge>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Badge Benefits:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Recognition in the BloodConnect community</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Special profile highlight</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                        <span>Exclusive access to certain rewards</span>
                      </li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {earnedBadges.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
              <p className="text-muted-foreground">Start donating blood to earn your first badge!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="pt-4">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {inProgressBadges.map((badge) => (
              <Card key={badge.id}>
                <CardHeader className="pb-2 text-center">
                  <div className="relative mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 mb-2">
                    {getIconComponent(badge.icon)}
                    <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
                  </div>
                  <CardTitle className="text-lg flex items-center justify-center">
                    {badge.name}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{badge.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-center pt-0">
                  <div className="w-full mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{badge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${badge.progress}%` }}></div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    In Progress
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>

          {inProgressBadges.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">All Badges Earned!</h3>
              <p className="text-muted-foreground">Congratulations! You've earned all available badges.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Badge Levels</CardTitle>
          <CardDescription>Earn badges by donating blood and participating in BloodConnect activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg border">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-500 mr-4">
                <Droplet className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium">First-Time Donor</h4>
                <p className="text-sm text-muted-foreground">Complete your first blood donation</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg border">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-500 mr-4">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium">Regular Donor</h4>
                <p className="text-sm text-muted-foreground">Donate blood 3 times</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg border">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-500 mr-4">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium">Lifesaver</h4>
                <p className="text-sm text-muted-foreground">Donate blood 5 times</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg border">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-500 mr-4">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium">Blood Warrior</h4>
                <p className="text-sm text-muted-foreground">Donate blood 10 times</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg border">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-500 mr-4">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium">Blood Champion</h4>
                <p className="text-sm text-muted-foreground">Donate blood 20 times</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

