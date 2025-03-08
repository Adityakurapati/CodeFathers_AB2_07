"use client"

import { Phone } from "lucide-react"
import { useEffect, useState } from "react"

export function EmergencyPulse() {
  const [pulsing, setPulsing] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsing((prev) => !prev)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute inset-0 bg-destructive/20 rounded-full ${pulsing ? "animate-ping" : ""}`}></div>
      <div className="relative bg-destructive text-destructive-foreground rounded-full w-14 h-14 flex items-center justify-center">
        <Phone className="h-6 w-6" />
      </div>
    </div>
  )
}

