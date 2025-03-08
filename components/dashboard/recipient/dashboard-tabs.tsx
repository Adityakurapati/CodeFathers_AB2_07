"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { InventoryTab } from "@/components/dashboard/recipient/tabs/inventory-tab"
import { RequestsTab } from "@/components/dashboard/recipient/tabs/requests-tab"
import { DemandTab } from "@/components/dashboard/recipient/tabs/demand-tab"

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

interface DemandData {
  day: string
  [key: string]: string | number
}

interface RecipientDashboardTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  inventory: InventoryItem[]
  activeRequests: Request[]
  demandData: DemandData[]
}

export function RecipientDashboardTabs({
  activeTab,
  setActiveTab,
  inventory,
  activeRequests,
  demandData,
}: RecipientDashboardTabsProps) {
  const [showAddStockDialog, setShowAddStockDialog] = useState(false)
  const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false)

  return (
    <div className="space-y-6 md:col-span-1">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="demand">Demand</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryTab
            inventory={inventory}
            showAddStockDialog={showAddStockDialog}
            setShowAddStockDialog={setShowAddStockDialog}
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <RequestsTab
            activeRequests={activeRequests}
            showCreateRequestDialog={showCreateRequestDialog}
            setShowCreateRequestDialog={setShowCreateRequestDialog}
          />
        </TabsContent>

        <TabsContent value="demand" className="space-y-4">
          <DemandTab demandData={demandData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

