import { SponsorRewards } from "@/components/sponsor-rewards"

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

interface ProfileRewardsTabProps {
  availableRewards: Reward[]
  redeemedRewards: Reward[]
}

export function ProfileRewardsTab({ availableRewards, redeemedRewards }: ProfileRewardsTabProps) {
  return <SponsorRewards availableRewards={availableRewards} redeemedRewards={redeemedRewards} />
}

