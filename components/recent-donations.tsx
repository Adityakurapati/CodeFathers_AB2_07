import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export function RecentDonations() {
  const donations = [
    {
      id: 1,
      date: "2023-12-15",
      location: "City Hospital",
      status: "completed",
    },
    {
      id: 2,
      date: "2023-09-03",
      location: "Red Cross Center",
      status: "completed",
    },
    {
      id: 3,
      date: "2023-06-20",
      location: "Community Drive",
      status: "completed",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Your donation history</CardDescription>
        </div>
        <Calendar className="h-5 w-5 text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{new Date(donation.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">{donation.location}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                Completed
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

