"use client"
import dynamic from "next/dynamic"

// Dynamically import the map components with no SSR
export const BloodRequestMapDynamic = dynamic(() => import("@/components/blood-request-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted/20">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
})

export const DonorNavigationMapDynamic = dynamic(() => import("@/components/donor-navigation-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted/20">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
})

