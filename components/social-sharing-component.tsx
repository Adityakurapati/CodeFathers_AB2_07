"use client"

import { useEffect, useRef, useState } from "react"
import { toPng } from "html-to-image"
import { Award, Download, Droplet, Facebook, Heart, Instagram, Share2, Twitter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface DonorProfile {
  name: string
  totalDonations: number
  points: number
  badges: {
    id: string
    name: string
    earned: boolean
  }[]
}

interface SocialSharingComponentProps {
  donor: DonorProfile
  onClose: () => void
}

export function SocialSharingComponent({ donor, onClose }: SocialSharingComponentProps) {
  const [template, setTemplate] = useState<string>("achievement")
  const [message, setMessage] = useState<string>(
    `I just donated blood and saved up to 3 lives! Join me in making a difference. #BloodConnect #SaveLives`,
  )
  const [sponsor, setSponsor] = useState<string>("Health Café")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [shareImage, setShareImage] = useState<string | null>(null)

  const shareCardRef = useRef<HTMLDivElement>(null)

  // Templates for social sharing
  const templates = {
    achievement: `I just donated blood and saved up to 3 lives! Join me in making a difference. #BloodConnect #SaveLives`,
    milestone: `Proud to have made ${donor.totalDonations} blood donations so far! Every drop counts. #BloodConnect #DonationMilestone`,
    badge: `I just earned the ${donor.badges.find((b) => b.earned)?.name || "Donor"} badge on BloodConnect! #BloodDonation #LifeSaver`,
  }

  // Sponsors for social sharing
  const sponsors = ["Health Café", "Fitness First", "BookWorld", "Green Grocers", "City Hospital"]

  useEffect(() => {
    // Set default message based on template
    setMessage(templates[template as keyof typeof templates])
  }, [template])

  const generateShareImage = async () => {
    if (!shareCardRef.current) return

    setIsGenerating(true)

    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      })

      setShareImage(dataUrl)
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!shareImage) return

    const link = document.createElement("a")
    link.download = `bloodconnect-share-${Date.now()}.png`
    link.href = shareImage
    link.click()
  }

  const getTemplateIcon = () => {
    switch (template) {
      case "achievement":
        return <Droplet className="h-8 w-8 text-primary" />
      case "milestone":
        return <Award className="h-8 w-8 text-amber-500" />
      case "badge":
        return <Heart className="h-8 w-8 text-red-500" />
      default:
        return <Droplet className="h-8 w-8 text-primary" />
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Share Your Impact
          </DialogTitle>
          <DialogDescription>
            Create a custom post to share your blood donation journey on social media.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Choose a Template</h3>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="achievement">Blood Donation Achievement</SelectItem>
                <SelectItem value="milestone">Donation Milestone</SelectItem>
                <SelectItem value="badge">Badge Earned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Customize Your Message</h3>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tag a Sponsor (Optional)</h3>
            <Select value={sponsor} onValueChange={setSponsor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sponsor" />
              </SelectTrigger>
              <SelectContent>
                {sponsors.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
                <SelectItem value="none">No Sponsor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Preview</h3>
            <div
              ref={shareCardRef}
              className="rounded-lg overflow-hidden border bg-white p-6"
              style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
            >
              <div className="flex items-center mb-4">
                <Droplet className="h-8 w-8 fill-primary text-white mr-2" />
                <span className="font-bold text-primary text-lg">BloodConnect</span>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  {getTemplateIcon()}
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="font-bold text-xl mb-2">{donor.name}</h3>
                <p className="text-gray-700 mb-3">{message}</p>

                <div className="flex justify-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {donor.totalDonations} Donations
                  </Badge>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700">
                    {donor.points} Points
                  </Badge>
                </div>

                {sponsor && sponsor !== "none" && (
                  <div className="text-sm text-gray-500 mt-2">Proudly supported by {sponsor}</div>
                )}
              </div>

              <div className="text-center text-sm text-gray-500 mt-6">
                Join me in saving lives. Donate blood today!
                <div className="mt-1">#BloodConnect #SaveLives</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!shareImage ? (
            <Button onClick={generateShareImage} className="w-full" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShareImage(null)} className="w-full sm:w-auto">
                Edit
              </Button>
              <Button onClick={downloadImage} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
              <div className="flex justify-center gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Share on Instagram</span>
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

