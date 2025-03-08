"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet"
import L from "leaflet";
import "leaflet/dist/leaflet.css";  // ✅ Required for leaflet
import "leaflet-routing-machine";   // ✅ Correct way to import routing machine
import "leaflet-routing-machine"

const donorIcon = L.icon({
  iconUrl: "/markers/donor-marker.png",
  iconRetinaUrl: "/markers/donor-marker-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const recipientIcon = L.icon({
  iconUrl: "/markers/recipient-marker.png",
  iconRetinaUrl: "/markers/recipient-marker-2x.png",
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

// Customize colors for different blood types
const bloodTypeColors = {
  'A+': '#FF5733', // Red-Orange
  'A-': '#FF8C33', // Light Orange
  'B+': '#33A8FF', // Blue
  'B-': '#33D4FF', // Light Blue
  'AB+': '#9C33FF', // Purple
  'AB-': '#CB33FF', // Light Purple
  'O+': '#32CD32', // Green
  'O-': '#90EE90', // Light Green
}

// Helper function to interpolate between two points
function interpolatePosition(start, end, fraction) {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction,
    lng: start.lng + (end.lng - start.lng) * fraction
  };
}

// Generate random nearby donor locations
// Replace the random donor generation with fixed donors
function getFixedNearbyDonors(centerLocation) {
  // Fixed offsets to create a pattern around the center
  const offsets = [
    { lat: 0.015, lng: 0.018, type: 'A+' },
    { lat: -0.012, lng: 0.022, type: 'B+' },
    { lat: 0.022, lng: -0.015, type: 'AB+' },
    { lat: -0.018, lng: -0.020, type: 'O+' },
    { lat: 0.008, lng: 0.025, type: 'A-' },
    { lat: -0.025, lng: 0.010, type: 'B-' },
    { lat: 0.020, lng: 0.008, type: 'AB-' },
    { lat: -0.015, lng: -0.010, type: 'O-' }
  ];
  
  // Fixed donor names
  const names = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Morgan', 'Casey', 'Riley', 'Jamie'];
  
  return offsets.map((offset, index) => ({
    name: names[index],
    bloodType: offset.type,
    location: {
      lat: centerLocation.lat + offset.lat,
      lng: centerLocation.lng + offset.lng
    },
    distance: Math.floor((Math.sqrt(offset.lat * offset.lat + offset.lng * offset.lng) * 111000)),
    lastDonated: 30 + (index * 5) // Varies from 30 to 65 days ago
  }));
}
// Component to update map view and handle routing
function MapUpdater({ donorLocation, recipientLocation, routeProgress }) {
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
        
        // Update the route info state with adjusted values based on progress
        const adjustedDistance = distance * (1 - routeProgress);
        const adjustedDuration = Math.ceil(duration * (1 - routeProgress));
        
        if (typeof window !== 'undefined') {
          window.routeInfo = {
            distance: adjustedDistance.toFixed(1),
            duration: adjustedDuration,
            totalDistance: distance.toFixed(1),
            totalDuration: duration
          };
          
          // Dispatch custom event to notify parent component
          const event = new CustomEvent('routeCalculated', { 
            detail: { 
              distance: adjustedDistance, 
              duration: adjustedDuration,
              totalDistance: distance,
              totalDuration: duration,
              path 
            } 
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
  }, [donorLocation, recipientLocation, routeProgress, map])

  return null
}

export default function BloodDonorMapSection({ initialDonorLocation, recipientLocation }) {
  const isSelected=sessionStorage.getItem('selected')==='true'||false;
  const mapRef = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [donorLocation, setDonorLocation] = useState(initialDonorLocation)
  const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
  const [useFallbackIcons, setUseFallbackIcons] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0); // 0 to 1, where 1 means journey complete
  const timerRef = useRef(null);
  const routePathRef = useRef(null);
  const [nearbyDonors, setNearbyDonors] = useState([]);
  
  // Configurable simulation settings
  const simulationInterval = 5000; // 5 seconds (changed from 30000)
  const totalSteps = 36; // To complete in 3 minutes (36 steps * 5 seconds = 180 seconds or 3 minutes)
  const stepIncrement = 1 / totalSteps;

  // Set default center to donor location or Pune, India
  const defaultCenter = { lat: 18.5204, lng: 73.8567 }; // Default to Pune
  const center = donorLocation?.lat && donorLocation?.lng 
    ? [donorLocation.lat, donorLocation.lng] 
    : [defaultCenter.lat, defaultCenter.lng];

  // Simulate donor movement every 5 seconds when tracking a specific donor
  useEffect(() => {
    if (isClient && isSelected && initialDonorLocation && recipientLocation) {
      const updateDonorPosition = () => {
        setRouteProgress(prev => {
          const newProgress = Math.min(prev + stepIncrement, 1);
          
          // If we have a route path, use it for accurate positioning
          if (routePathRef.current && routePathRef.current.length > 0) {
            const path = routePathRef.current;
            const pathIndex = Math.floor(newProgress * (path.length - 1));
            const position = path[pathIndex];
            
            if (position) {
              setDonorLocation({
                lat: position.lat,
                lng: position.lng
              });
            } else {
              // Fallback to simple linear interpolation
              const newPosition = interpolatePosition(
                initialDonorLocation, 
                recipientLocation, 
                newProgress
              );
              setDonorLocation(newPosition);
            }
          } else {
            // Simple linear interpolation between donor and recipient
            const newPosition = interpolatePosition(
              initialDonorLocation, 
              recipientLocation, 
              newProgress
            );
            setDonorLocation(newPosition);
          }
          
          // Stop the timer when we reach the destination
          if (newProgress >= 1) {
            clearInterval(timerRef.current);
          }
          
          return newProgress;
        });
      };
      
      // Update every 5 seconds
      timerRef.current = setInterval(updateDonorPosition, simulationInterval);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isClient, isSelected, initialDonorLocation, recipientLocation, stepIncrement, simulationInterval]);

  // Generate nearby donors for the "available donors" view
  // Replace the random generator with the fixed one
useEffect(() => {
  if (isClient && !isSelected) {
    // Use fixed donor positions when in "available donors" mode
    const userLocation = initialDonorLocation || defaultCenter;
    const donors = getFixedNearbyDonors(userLocation);
    setNearbyDonors(donors);
  }
}, [isClient, isSelected, initialDonorLocation]); // Only depend on these props
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
    
    // Listen for route calculation events (only relevant for tracking view)
    const handleRouteCalculated = (e) => {
      setRouteInfo({
        distance: e.detail.distance.toFixed(1),
        duration: e.detail.duration
      });
      
      // Store the path for using in position updates
      if (e.detail.path && e.detail.path.length > 0) {
        routePathRef.current = e.detail.path;
      }
    };
    
    window.addEventListener('routeCalculated', handleRouteCalculated);
    
    return () => {
      window.removeEventListener('routeCalculated', handleRouteCalculated);
    };
  }, [])

  // Calculate remaining time based on progress
  const getRemainingTime = () => {
    if (!routeInfo.duration && !window.routeInfo?.duration) return null;
    const baseDuration = routeInfo.duration || window.routeInfo?.duration;
    return Math.ceil(baseDuration * (1 - routeProgress));
  };

  return (
    <div className="h-[50vh] w-full relative z-0">
      {isClient && (
        <>
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} ref={mapRef}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* DONOR TRACKING VIEW */}
            {isSelected && (
              <>
                {/* Donor marker */}
                {donorLocation && (
                  <Marker 
                    position={[donorLocation.lat, donorLocation.lng]} 
                    icon={useFallbackIcons ? defaultDonorIcon : donorIcon}
                  >
                    <Popup className="font-medium">
                      Your Location (Donor)
                      <br/>
                      <span className="text-xs text-blue-600">On the way</span>
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

                <MapUpdater 
                  donorLocation={donorLocation} 
                  recipientLocation={recipientLocation} 
                  routeProgress={routeProgress}
                />
              </>
            )}

            {/* AVAILABLE DONORS VIEW */}
            {!isSelected && (
              <>
                {/* User's location */}
                {initialDonorLocation && (
                  <>
                    <Marker 
                      position={[initialDonorLocation.lat, initialDonorLocation.lng]} 
                      icon={useFallbackIcons ? defaultRecipientIcon : recipientIcon}
                    >
                      <Popup className="font-medium">
                        Your Location
                        <br/>
                        <span className="text-xs text-red-600">Looking for donors</span>
                      </Popup>
                    </Marker>
                    
                    {/* Radius circle around user's location */}
                    <Circle 
                      center={[initialDonorLocation.lat, initialDonorLocation.lng]}
                      radius={5000} // 5km radius
                      pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
                    />
                  </>
                )}
                
                {/* Nearby donors */}
                {nearbyDonors.map((donor, index) => {
                  // Create custom icon for blood type
                  const bloodTypeIcon = L.divIcon({
                    html: `<div style="background-color: ${bloodTypeColors[donor.bloodType] || '#3388ff'}; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${donor.bloodType}</div>`,
                    className: 'blood-type-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    popupAnchor: [0, -15]
                  });
                  
                  return (
                    <Marker 
                      key={index}
                      position={[donor.location.lat, donor.location.lng]} 
                      icon={bloodTypeIcon}
                    >
                      <Popup className="font-medium">
                        <div className="text-sm">
                          <p className="font-bold mb-1">{donor.name} - {donor.bloodType}</p>
                          <p className="mb-1">Distance: {(donor.distance / 1000).toFixed(1)} km</p>
                          <p className="text-xs text-gray-600">Last donated: {donor.lastDonated} days ago</p>
                          <button className="mt-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-600 transition">
                            Request Donation
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </>
            )}
          </MapContainer>

          {/* ROUTE INFO FOR TRACKING VIEW */}
          {isSelected && (routeInfo.distance || window.routeInfo?.distance) && (
            <div className="absolute bottom-2 left-2 z-[1000] rounded bg-white p-3 shadow-md border border-blue-200">
              <h3 className="text-sm font-bold text-blue-800 mb-1">Route Information</h3>
              <p className="text-sm font-medium flex items-center">
                <span className="mr-1">📏</span> Remaining: {routeInfo.distance || window.routeInfo?.distance} km
              </p>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1">⏱️</span> Est. arrival in: {getRemainingTime()} min
              </p>
              {routeProgress > 0 && (
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${routeProgress * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          {/* LEGEND FOR AVAILABLE DONORS VIEW */}
          {!isSelected && (
            <div className="absolute top-2 right-2 z-[1000] rounded bg-white p-3 shadow-md border border-blue-200">
              <h3 className="text-sm font-bold text-blue-800 mb-1">Blood Types</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {Object.entries(bloodTypeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: color }}
                    ></div>
                    {type}
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2 text-gray-600">
                {nearbyDonors.length} donors available nearby
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}