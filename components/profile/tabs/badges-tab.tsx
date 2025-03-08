import { BadgeDisplay } from "@/components/badge-display"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earned: boolean
  earnedDate?: string
  progress?: number
}

interface ProfileBadgesTabProps {
  earnedBadges: Badge[]
  inProgressBadges: Badge[]
}

export function ProfileBadgesTab({ earnedBadges, inProgressBadges }: ProfileBadgesTabProps) {
  return <BadgeDisplay earnedBadges={earnedBadges} inProgressBadges={inProgressBadges} />
}

