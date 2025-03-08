import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Calculate distance between two coordinates in kilometers
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return Number.parseFloat(distance.toFixed(1))
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Format time ago from date string
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 60) {
    return `${diffMins} min ago`
  } else {
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    }
  }
}

// Format urgency level
export function formatUrgencyLevel(level: string): string {
  switch (level) {
    case "immediate":
      return "Immediate"
    case "within12Hours":
      return "Within 12 Hours"
    case "within24Hours":
      return "Within 24 Hours"
    case "scheduled":
      return "Scheduled"
    default:
      return level
  }
}

// Get urgency color class
export function getUrgencyColor(level: string): string {
  switch (level) {
    case "immediate":
      return "bg-red-500"
    case "within12Hours":
      return "bg-orange-500"
    case "within24Hours":
      return "bg-yellow-500"
    case "scheduled":
      return "bg-green-500"
    default:
      return "bg-blue-500"
  }
}

// Format date for display
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Calculate progress percentage
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0
  const percentage = (current / target) * 100
  return Math.min(100, Math.max(0, percentage))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

