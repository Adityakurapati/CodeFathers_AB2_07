import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InventoryItem {
  id: string
  bloodType: string
  quantity: number
  expiryDate: string
}

interface Request {
  id: string
  patientName: string
  bloodType: string
  quantity: number
  urgencyLevel: string
  hospital: string
  requestDate: string
  status: string
  acceptedBy?: string
  estimatedArrival?: string
}

interface RecipientDashboardSummaryProps {
  inventory: InventoryItem[]
  activeRequests: Request[]
}

export function RecipientDashboardSummary({ inventory, activeRequests }: RecipientDashboardSummaryProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Inventory</CardTitle>
          <CardDescription>Current blood units available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{inventory.reduce((total, item) => total + item.quantity, 0)}</div>
          <p className="text-sm text-muted-foreground">Units across all blood types</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Critical Levels</CardTitle>
          <CardDescription>Blood types in urgent need</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {inventory
              .filter((item) => item.quantity <= 5)
              .map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {item.bloodType}
                  </Badge>
                  <span className="text-red-500 font-bold">{item.quantity} units</span>
                </div>
              ))}
            {inventory.filter((item) => item.quantity <= 5).length === 0 && (
              <p className="text-sm text-muted-foreground">No critical levels at the moment</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Active Requests</CardTitle>
          <CardDescription>Current blood requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeRequests.length}</div>
          <p className="text-sm text-muted-foreground">
            {activeRequests.filter((req) => req.status === "accepted").length} accepted,{" "}
            {activeRequests.filter((req) => req.status === "pending").length} pending
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

