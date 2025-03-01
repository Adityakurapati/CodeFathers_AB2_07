"use client"

import { useEffect, useState } from "react"
import { Droplet, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"

interface MapMarker {
  position: { lat: number; lng: number }
  title: string
  type: "donor" | "request" | "hospital"
}

interface MapComponentProps {
  markers?: MapMarker[]
  selectedLocation?: { lat: number; lng: number } | null
  height?: string
  width?: string
}

// This would normally come from an environment variable
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"

export function MapComponent({
  markers = [],
  selectedLocation = null,
  height = "100%",
  width = "100%",
}: MapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Default center (New York City)
  const defaultCenter = { lat: 40.7128, lng: -74.006 }

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.log("Error getting location")
        },
      )
    }
  }, [])

  // Center map on selected location
  useEffect(() => {
    if (map && selectedLocation) {
      map.panTo(selectedLocation)
      map.setZoom(14)
    }
  }, [map, selectedLocation])

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "donor":
        return {
          path: "M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#b91c1c",
          scale: 1.5,
        }
      case "request":
        return {
          path: "M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#1d4ed8",
          scale: 1.5,
        }
      case "hospital":
        return {
          path: "M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
          fillColor: "#10b981",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#047857",
          scale: 1.5,
        }
      default:
        return null
    }
  }

  const containerStyle = {
    width,
    height,
  }

  // For demo purposes, we'll use a placeholder map
  return (
    <div className="relative w-full h-full rounded-md overflow-hidden bg-gray-100">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground mb-4">Map integration would display donor and recipient locations here.</p>
        <div className="space-y-2 w-full max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Donors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Blood Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Hospitals</span>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm">
            <Droplet className="mr-2 h-4 w-4" />
            Find Nearest Donation Center
          </Button>
        </div>
      </div>

      {/* Uncomment this section and add your Google Maps API key to enable the actual map
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedLocation || userLocation || defaultCenter}
          zoom={12}
          onLoad={setMap}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4f46e5",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff",
              }}
              title="Your Location"
            />
          )}
          
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={getMarkerIcon(marker.type)}
              title={marker.title}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}
          
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-medium">{selectedMarker.title}</h3>
                <p className="text-sm">
                  {selectedMarker.type === "donor" 
                    ? "Available Donor" 
                    : selectedMarker.type === "request" 
                      ? "Blood Request" 
                      : "Hospital"}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      */}
    </div>
  )
}

