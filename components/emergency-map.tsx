"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface EmergencyMapProps {
  showResponders?: boolean
}

export function EmergencyMap({ showResponders = false }: EmergencyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Load map image
    const mapImage = new Image()
    mapImage.crossOrigin = "anonymous"
    mapImage.src = "/placeholder.svg?height=600&width=800"

    const drawMap = () => {
      if (!ctx) return

      // Draw map background
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height)

      // Draw user location marker
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw pulse effect around user location
      ctx.strokeStyle = "rgba(239, 68, 68, 0.6)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2)
      ctx.stroke()

      if (showResponders) {
        // Draw responder location
        const responderX = canvas.width / 2 - 100
        const responderY = canvas.height / 2 + 100

        // Draw responder marker
        ctx.fillStyle = "#3b82f6"
        ctx.beginPath()
        ctx.arc(responderX, responderY, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw route from responder to user
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 3
        ctx.setLineDash([5, 3])
        ctx.beginPath()
        ctx.moveTo(responderX, responderY)
        ctx.lineTo(canvas.width / 2, canvas.height / 2)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    mapImage.onload = () => {
      setIsLoading(false)
      drawMap()

      // Animation loop for pulse effect
      let pulseSize = 20
      let growing = true
      const animatePulse = () => {
        if (!ctx) return

        // Redraw map and markers
        drawMap()

        // Draw animated pulse
        ctx.strokeStyle = "rgba(239, 68, 68, 0.4)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2)
        ctx.stroke()

        // Update pulse size
        if (growing) {
          pulseSize += 0.5
          if (pulseSize >= 40) growing = false
        } else {
          pulseSize -= 0.5
          if (pulseSize <= 20) growing = true
        }

        requestAnimationFrame(animatePulse)
      }

      animatePulse()
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas || !ctx) return
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      drawMap()
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [showResponders])

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

