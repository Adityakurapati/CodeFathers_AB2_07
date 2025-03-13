"use client"

import { CheckCircle, Clock, Droplet, Hospital, Truck, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DonationStage {
  name: string
  completed: boolean
  timestamp?: string
  estimatedTime?: string
}

interface ActiveDonation {
  id: string
  patientName: string
  hospitalName: string
  bloodType: string
  donationDate: string
  status: "matched" | "collected" | "transported" | "delivered"
  eta: string
  stages: DonationStage[]
}

interface CurrentDonationStatusProps {
  activeDonation: ActiveDonation | null
}

export function CurrentDonationStatus({ activeDonation }: CurrentDonationStatusProps) {
  if (!activeDonation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Donation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Droplet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Donations</h3>
            <p className="text-muted-foreground">You don't have any active donations at the moment.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStageIcon = (stageName: string, completed: boolean) => {
    const className = `h-5 w-5 ${completed ? "text-green-500" : "text-gray-400"}`

    switch (stageName.toLowerCase()) {
      case "matched":
        return <User className={className} />
      case "collected":
        return <Droplet className={className} />
      case "transported":
        return <Truck className={className} />
      case "delivered":
        return <Hospital className={className} />
      default:
        return <CheckCircle className={className} />
    }
  }

  const getStatusMessage = () => {
    switch (activeDonation.status) {
      case "matched":
        return `Your ${activeDonation.bloodType} blood has been matched with a recipient at ${activeDonation.hospitalName}.`
      case "collected":
        return `Your ${activeDonation.bloodType} blood has been collected and is being prepared for transport to ${activeDonation.hospitalName}.`
      case "transported":
        return `Your ${activeDonation.bloodType} blood is en route to ${activeDonation.hospitalName} (ETA: ${activeDonation.eta}).`
      case "delivered":
        return `Your ${activeDonation.bloodType} blood has been delivered to ${activeDonation.hospitalName} and is helping save lives!`
      default:
        return `Your ${activeDonation.bloodType} blood donation is in progress.`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Donation Status</span>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Donation Date: {new Date(activeDonation.donationDate).toLocaleDateString()}
          </p>
          <p className="font-medium">{getStatusMessage()}</p>
        </div>

        <div className="relative mt-8">
          {/* Timeline track */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline stages */}
          <div className="space-y-8">
            {activeDonation.stages.map((stage, index) => (
              <div key={index} className="relative pl-10">
                <div
                  className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    stage.completed ? "bg-green-100 border-2 border-green-500" : "bg-gray-100 border-2 border-gray-300"
                  }`}
                >
                  {getStageIcon(stage.name, stage.completed)}
                </div>
                <div>
                  <h4 className="font-medium flex items-center">
                    {stage.name}
                    {stage.completed && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                  </h4>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Clock className="mr-1 h-3 w-3" />
                    {stage.completed
                      ? `Completed at ${new Date(stage.timestamp!).toLocaleTimeString()}`
                      : `Estimated: ${new Date(stage.estimatedTime!).toLocaleTimeString()}`}
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

