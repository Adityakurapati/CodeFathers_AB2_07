"use client"

import { useState } from "react"
import { Check, Copy, Gift, Info, ShoppingBag } from "lucide-react"

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

interface RewardType {
  id: string
  sponsor: string
  title: string
  description: string
  expiryDate: string
  code: string
  redeemed: boolean
  image: string
}

interface SponsorRewardsProps {
  availableRewards: RewardType[]
  redeemedRewards: RewardType[]
}

export function SponsorRewards({ availableRewards, redeemedRewards }: SponsorRewardsProps) {
  const [selectedReward, setSelectedReward] = useState<RewardType | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="available">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Rewards ({availableRewards.length})</TabsTrigger>
          <TabsTrigger value="redeemed">Redeemed Rewards ({redeemedRewards.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="pt-4">
          <div className="grid gap-6 sm:grid-cols-2">
            {availableRewards.map((reward) => (
              <Dialog key={reward.id}>
                <DialogTrigger asChild>
                  <Card
                    className="cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setSelectedReward(reward)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{reward.title}</CardTitle>
                          <CardDescription>Sponsored by {reward.sponsor}</CardDescription>
                        </div>
                        <img
                          src={reward.image || "/placeholder.svg"}
                          alt={reward.sponsor}
                          className="w-16 h-12 object-contain"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Gift className="mr-1 h-3 w-3" />
                        Available
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                      </span>
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl">{reward.title}</DialogTitle>
                    <DialogDescription>Sponsored by {reward.sponsor}</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center justify-center py-4">
                    <img
                      src={reward.image || "/placeholder.svg"}
                      alt={reward.sponsor}
                      className="w-32 h-24 object-contain mb-4"
                    />
                    <p className="text-center mb-4">{reward.description}</p>
                    <div className="bg-muted p-3 rounded-lg w-full mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Promo Code:</span>
                        <div className="flex items-center">
                          <code className="bg-background px-2 py-1 rounded border mr-2">{reward.code}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(reward.code)}
                            className="h-8 w-8"
                          >
                            {copiedCode === reward.code ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            <span className="sr-only">Copy code</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      Expires on {new Date(reward.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How to Redeem:</h4>
                    <ol className="space-y-2 text-sm list-decimal pl-4">
                      <li>Copy the promo code above</li>
                      <li>Visit the sponsor's website or physical store</li>
                      <li>Apply the code during checkout or show it to the cashier</li>
                      <li>Enjoy your reward!</li>
                    </ol>
                  </div>
                  <Button className="w-full" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Visit Sponsor Website
                    </a>
                  </Button>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {availableRewards.length === 0 && (
            <div className="text-center py-12">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Available Rewards</h3>
              <p className="text-muted-foreground">Donate blood to earn rewards from our sponsors!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="redeemed" className="pt-4">
          <div className="grid gap-6 sm:grid-cols-2">
            {redeemedRewards.map((reward) => (
              <Card key={reward.id} className="opacity-75">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      <CardDescription>Sponsored by {reward.sponsor}</CardDescription>
                    </div>
                    <img
                      src={reward.image || "/placeholder.svg"}
                      alt={reward.sponsor}
                      className="w-16 h-12 object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" />
                    Redeemed
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Expired: {new Date(reward.expiryDate).toLocaleDateString()}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>

          {redeemedRewards.length === 0 && (
            <div className="text-center py-12">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Redeemed Rewards</h3>
              <p className="text-muted-foreground">You haven't redeemed any rewards yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>How Rewards Work</CardTitle>
          <CardDescription>Earn rewards from our sponsors by donating blood and earning points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start p-4 rounded-lg border">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary mr-4 mt-1">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Donate Blood</h4>
                <p className="text-sm text-muted-foreground">
                  Each time you donate blood, you earn points based on the donation type and urgency.
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 rounded-lg border">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary mr-4 mt-1">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Earn Points</h4>
                <p className="text-sm text-muted-foreground">
                  Points are automatically added to your account after each verified donation.
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 rounded-lg border">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary mr-4 mt-1">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Unlock Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  As you accumulate points, you'll unlock rewards from our sponsor partners.
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 rounded-lg border">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary mr-4 mt-1">
                <span className="font-bold">4</span>
              </div>
              <div>
                <h4 className="font-medium">Redeem Benefits</h4>
                <p className="text-sm text-muted-foreground">
                  Use your reward codes at our partner locations or websites to enjoy special discounts and offers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

