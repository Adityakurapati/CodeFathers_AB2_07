"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InventoryItem {
  id: string
  bloodType: string
  quantity: number
  expiryDate: string
}

interface InventoryTabProps {
  inventory: InventoryItem[]
  showAddStockDialog: boolean
  setShowAddStockDialog: (show: boolean) => void
}

export function InventoryTab({ inventory, showAddStockDialog, setShowAddStockDialog }: InventoryTabProps) {
  const [selectedBloodType, setSelectedBloodType] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddStock = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowAddStockDialog(false)
      // Reset form
      setSelectedBloodType("")
      setQuantity("1")
      setExpiryDate("")
    }, 1000)
  }

  const getQuantityClass = (quantity: number) => {
    if (quantity <= 5) return "text-red-500 font-bold"
    if (quantity <= 10) return "text-amber-500 font-bold"
    return "text-green-500 font-bold"
  }

  const getExpiryClass = (expiryDate: string) => {
    const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry <= 3) return "text-red-500 font-bold"
    if (daysUntilExpiry <= 7) return "text-amber-500 font-bold"
    return "text-muted-foreground"
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blood Inventory</h2>
        <Dialog open={showAddStockDialog} onOpenChange={setShowAddStockDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Blood Stock</DialogTitle>
              <DialogDescription>Enter details about the new blood stock to add to inventory.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="blood-type">Blood Type</Label>
                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger id="blood-type">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity (Units)</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddStockDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStock} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Stock"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-4 p-3 bg-muted/50">
          <div className="font-medium">Blood Type</div>
          <div className="font-medium">Quantity</div>
          <div className="font-medium">Expiry Date</div>
          <div className="font-medium text-right">Actions</div>
        </div>
        <div className="divide-y">
          {inventory.map((item) => (
            <div key={item.id} className="grid grid-cols-4 p-3 items-center">
              <div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {item.bloodType}
                </Badge>
              </div>
              <div className={getQuantityClass(item.quantity)}>{item.quantity} units</div>
              <div className={getExpiryClass(item.expiryDate)}>{new Date(item.expiryDate).toLocaleDateString()}</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

