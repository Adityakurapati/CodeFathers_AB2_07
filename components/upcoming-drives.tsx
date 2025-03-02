import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export function UpcomingDrives() {
  const drives = [
    {
      id: 1,
      date: "2024-04-15",
      location: "City Hospital",
      address: "123 Main St",
    },
    {
      id: 2,
      date: "2024-04-22",
      location: "Community Center",
      address: "456 Oak Ave",
    },
    {
      id: 3,
      date: "2024-05-05",
      location: "University Campus",
      address: "789 College Blvd",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Upcoming Drives</CardTitle>
          <CardDescription>Blood donation events near you</CardDescription>
        </div>
        <Calendar className="h-5 w-5 text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drives.map((drive) => (
            <div key={drive.id} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{drive.location}</p>
                <p className="text-sm text-gray-500">{drive.address}</p>
                <p className="text-sm text-gray-500">{new Date(drive.date).toLocaleDateString()}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Schedule
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

