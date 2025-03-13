"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for Leaflet marker icons in Next.js
const useClientSideEffect = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const donorIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Component to update map view when props change
function MapUpdater({ center }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])

  return null
}

export default function BloodRequestMap({ recipientLocation, donors = [] }) {
  const mapRef = useRef(null)
  const isClient = useClientSideEffect()

  useEffect(() => {
    if (isClient) {
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
    }
  }, [isClient])

  // Set default center if location is not available
  const center =
    recipientLocation?.lat && recipientLocation?.lng
      ? [recipientLocation.lat, recipientLocation.lng]
      : [40.7128, -74.006] // Default to NYC

  return (
    <div className="h-full w-full">
      {typeof window !== "undefined" && (
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Recipient marker */}
          <Marker position={center} icon={markerIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Donor markers */}
          {donors.map((donor) => (
            <Marker key={donor.id} position={[donor.lat, donor.lng]} icon={donorIcon}>
              <Popup>
                <div className="space-y-1 p-1">
                  <p className="font-medium">{donor.name}</p>
                  <p className="text-sm">Blood Type: {donor.bloodType}</p>
                  <p className="text-sm">Distance: {donor.distance} km</p>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapUpdater center={center} />
        </MapContainer>
      )}
    </div>
  )
}

