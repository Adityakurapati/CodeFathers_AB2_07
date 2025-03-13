"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import "leaflet-routing-machine"

const donorIcon = L.icon({
  iconUrl: "/markers/donor-marker.png", // Custom donor marker - you'll need to add this file
  iconRetinaUrl: "/markers/donor-marker-2x.png", // Custom donor marker for retina - you'll need to add this file
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const recipientIcon = L.icon({
  iconUrl: "/markers/recipient-marker.png", // Custom recipient marker - you'll need to add this file
  iconRetinaUrl: "/markers/recipient-marker-2x.png", // Custom recipient marker for retina - you'll need to add this file
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Fallback to default markers if custom ones aren't available
const defaultDonorIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const defaultRecipientIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Component to update map view and handle routing
function MapUpdater({ donorLocation, recipientLocation }) {
  const map = useMap()
  const routingControlRef = useRef(null)
  const routeMarkersRef = useRef([])

  useEffect(() => {
    if (donorLocation && recipientLocation) {
      // Create bounds that include both donor and recipient
      const bounds = L.latLngBounds(
        [donorLocation.lat, donorLocation.lng],
        [recipientLocation.lat, recipientLocation.lng],
      )
      map.fitBounds(bounds, { padding: [50, 50] })
      
      // Remove previous routing control if it exists
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
      }

      // Clear any previous route markers
      routeMarkersRef.current.forEach(marker => {
        if (marker) map.removeLayer(marker)
      })
      routeMarkersRef.current = []

      // Create a new routing control with enhanced styling
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(donorLocation.lat, donorLocation.lng),
          L.latLng(recipientLocation.lat, recipientLocation.lng)
        ],
        routeWhileDragging: false,
        lineOptions: {
          styles: [
            { color: '#3B82F6', weight: 6, opacity: 0.7 }, // Base layer - blue
            { color: '#1E40AF', weight: 2, opacity: 0.9, dashArray: '10, 10' } // Dashed overlay for visual interest
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        },
        createMarker: function() { return null; }, // Don't create default markers
        addWaypoints: false, // Prevent adding new waypoints
        draggableWaypoints: false, // Prevent dragging waypoints
        fitSelectedRoutes: true,
        showAlternatives: false,
        show: false, // Hide the routing instructions panel
        collapsible: true
      }).addTo(map);
      
      // Access route info when route is calculated
      routingControlRef.current.on('routesfound', function(e) {
        const routes = e.routes;
        const route = routes[0]; // Get the first route
        const path = route.coordinates; // Get the path coordinates
        
        // Calculate distance and duration
        const summary = route.summary;
        const distance = summary.totalDistance / 1000; // Convert to km
        const duration = Math.ceil(summary.totalTime / 60); // Convert to minutes
        
        // Add direction arrows along the route
        const arrowCount = Math.min(Math.ceil(distance), 8); // Cap at 8 arrows
        if (arrowCount > 0) {
          const increment = Math.floor(path.length / (arrowCount + 1));
          
          for (let i = 1; i <= arrowCount; i++) {
            const position = path[i * increment];
            if (position) {
              // Create a custom direction marker
              const directionMarker = L.marker([position.lat, position.lng], {
                icon: L.divIcon({
                  html: '<div style="color:white; background-color:#3B82F6; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.3);">→</div>',
                  className: 'direction-marker',
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                }),
                interactive: false
              });
              directionMarker.addTo(map);
              routeMarkersRef.current.push(directionMarker);
            }
          }
        }
        
        // Update the route info state
        if (typeof window !== 'undefined') {
          window.routeInfo = {
            distance: distance.toFixed(1),
            duration: duration
          };
          
          // Dispatch custom event to notify parent component
          const event = new CustomEvent('routeCalculated', { 
            detail: { distance, duration, path } 
          });
          window.dispatchEvent(event);
        }
      });
    } else if (donorLocation) {
      map.setView([donorLocation.lat, donorLocation.lng], 13)
      
      // Remove routing if only donor location is available
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }
      
      // Clear any route markers
      routeMarkersRef.current.forEach(marker => {
        if (marker) map.removeLayer(marker)
      })
      routeMarkersRef.current = []
    }
    
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
      }
      routeMarkersRef.current.forEach(marker => {
        if (marker) map.removeLayer(marker)
      });
    }
  }, [donorLocation, recipientLocation, map])

  return null
}

export default function DonorNavigationMap({ donorLocation, recipientLocation }) {
  const mapRef = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
  const [useFallbackIcons, setUseFallbackIcons] = useState(false);

  useEffect(() => {
    setIsClient(true)
    
    // Check if custom icons are available, use fallbacks if not
    const checkIcons = async () => {
      try {
        // Try to load donor icon as a test
        await fetch('/donor-marker.png');
      } catch (error) {
        setUseFallbackIcons(true);
      }
    };
    checkIcons();
    
    // Fix for Leaflet marker icons in Next.js
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
    
    // Listen for route calculation events
    const handleRouteCalculated = (e) => {
      setRouteInfo({
        distance: e.detail.distance.toFixed(1),
        duration: e.detail.duration
      });
    };
    
    window.addEventListener('routeCalculated', handleRouteCalculated);
    
    return () => {
      window.removeEventListener('routeCalculated', handleRouteCalculated);
    };
  }, [])

  // Set default center to donor location or Pune, India
  const center = donorLocation?.lat && donorLocation?.lng 
    ? [donorLocation.lat, donorLocation.lng] 
    : [18.5204, 73.8567] // Default to Pune

  return (
    <div className="h-full w-full relative">
      {isClient && (
        <>
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} ref={mapRef}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Donor marker */}
            {donorLocation && (
              <Marker 
                position={[donorLocation.lat, donorLocation.lng]} 
                icon={useFallbackIcons ? defaultDonorIcon : donorIcon}
              >
                <Popup className="font-medium">
                  Your Location (Donor)
                  <br/>
                  <span className="text-xs text-blue-600">Starting point</span>
                </Popup>
              </Marker>
            )}

            {/* Recipient marker */}
            {recipientLocation && (
              <Marker 
                position={[recipientLocation.lat, recipientLocation.lng]} 
                icon={useFallbackIcons ? defaultRecipientIcon : recipientIcon}
              >
                <Popup className="font-medium">
                  Recipient Location
                  <br/>
                  <span className="text-xs text-red-600">Destination</span>
                </Popup>
              </Marker>
            )}

            <MapUpdater donorLocation={donorLocation} recipientLocation={recipientLocation} />
          </MapContainer>

          {(routeInfo.distance || window.routeInfo?.distance) && (
            <div className="absolute bottom-2 left-2 z-[1000] rounded bg-white p-3 shadow-md border border-blue-200">
              <h3 className="text-sm font-bold text-blue-800 mb-1">Route Information</h3>
              <p className="text-sm font-medium flex items-center">
                <span className="mr-1">📏</span> Distance: {routeInfo.distance || window.routeInfo?.distance} km
              </p>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1">⏱️</span> Est. travel time: {routeInfo.duration || window.routeInfo?.duration} min
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}