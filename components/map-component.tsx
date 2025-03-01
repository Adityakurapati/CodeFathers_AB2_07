"use client"

import React, { useEffect, useRef, useState } from 'react';

export function MapComponent({ startLocation, endLocation }) {
        const mapRef = useRef(null);
        const mapInstanceRef = useRef(null);
        const markersRef = useRef([]);
        const routeLayerRef = useRef(null);
        const [distance, setDistance] = useState(null);
        const [leafletLoaded, setLeafletLoaded] = useState(false);

        // First useEffect to load Leaflet
        useEffect(() => {
                // Only attempt to load if not already loaded
                if (window.L || leafletLoaded) {
                        setLeafletLoaded(true);
                        return;
                }

                const loadLeaflet = async () => {
                        try {
                                // Create and append the CSS link for Leaflet
                                const link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                                link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                                link.crossOrigin = '';
                                document.head.appendChild(link);

                                // Load the Leaflet script
                                const script = document.createElement('script');
                                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                                script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                                script.crossOrigin = '';

                                // Wait for the script to load
                                await new Promise((resolve) => {
                                        script.onload = resolve;
                                        document.head.appendChild(script);
                                });

                                // Mark Leaflet as loaded
                                setLeafletLoaded(true);
                        } catch (error) {
                                console.error("Failed to load Leaflet:", error);
                        }
                };

                loadLeaflet();
        }, []);

        // Second useEffect to initialize and update the map
        useEffect(() => {
                // Only proceed if Leaflet is loaded and we have a map container
                if (!leafletLoaded || !mapRef.current) return;

                // Also ensure we have at least one location to show
                if (!startLocation && !endLocation) return;

                // Function to initialize or update the map
                const initializeMap = () => {
                        // If map doesn't exist yet, create it
                        if (!mapInstanceRef.current) {
                                // Initialize the map with the center point between start and end locations
                                // or default to startLocation if endLocation is not provided
                                const centerLat = endLocation && startLocation ?
                                        (startLocation.lat + endLocation.lat) / 2 :
                                        startLocation ? startLocation.lat : endLocation.lat;

                                const centerLng = endLocation && startLocation ?
                                        (startLocation.lng + endLocation.lng) / 2 :
                                        startLocation ? startLocation.lng : endLocation.lng;

                                mapInstanceRef.current = window.L.map(mapRef.current).setView([centerLat, centerLng], 12);

                                // Add the OpenStreetMap tile layer
                                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                }).addTo(mapInstanceRef.current);
                        }

                        // Clear existing markers
                        markersRef.current.forEach(marker => {
                                marker.remove();
                        });
                        markersRef.current = [];

                        // Clear existing route
                        if (routeLayerRef.current) {
                                routeLayerRef.current.remove();
                                routeLayerRef.current = null;
                        }

                        // Add markers for the locations
                        if (startLocation) {
                                const startMarker = window.L.marker([startLocation.lat, startLocation.lng], {
                                        title: 'Start Location',
                                        icon: window.L.divIcon({
                                                className: 'custom-div-icon',
                                                html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                                                iconSize: [20, 20],
                                                iconAnchor: [10, 10]
                                        })
                                }).addTo(mapInstanceRef.current);

                                startMarker.bindPopup('Start Location');
                                markersRef.current.push(startMarker);
                        }

                        if (endLocation) {
                                const endMarker = window.L.marker([endLocation.lat, endLocation.lng], {
                                        title: 'End Location',
                                        icon: window.L.divIcon({
                                                className: 'custom-div-icon',
                                                html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                                                iconSize: [20, 20],
                                                iconAnchor: [10, 10]
                                        })
                                }).addTo(mapInstanceRef.current);

                                endMarker.bindPopup('End Location');
                                markersRef.current.push(endMarker);
                        }

                        // If both locations are provided, draw a path and calculate distance
                        if (startLocation && endLocation) {
                                try {
                                        // Create a polyline between the two points
                                        const pathLatLngs = [
                                                [startLocation.lat, startLocation.lng],
                                                [endLocation.lat, endLocation.lng]
                                        ];

                                        routeLayerRef.current = window.L.polyline(pathLatLngs, {
                                                color: '#6366f1',
                                                weight: 4,
                                                opacity: 0.7,
                                                dashArray: '10, 10',
                                                lineJoin: 'round'
                                        }).addTo(mapInstanceRef.current);

                                        // Calculate the distance using the Haversine formula
                                        const calculateDistance = (lat1, lon1, lat2, lon2) => {
                                                const R = 6371; // Radius of the earth in km
                                                const dLat = deg2rad(lat2 - lat1);
                                                const dLon = deg2rad(lon2 - lon1);
                                                const a =
                                                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                                        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                                                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                                return R * c; // Distance in km
                                        };

                                        const deg2rad = (deg) => {
                                                return deg * (Math.PI / 180);
                                        };

                                        const distanceInKm = calculateDistance(
                                                startLocation.lat,
                                                startLocation.lng,
                                                endLocation.lat,
                                                endLocation.lng
                                        ).toFixed(2);

                                        setDistance(distanceInKm);

                                        // Add a label with the distance
                                        const midPoint = {
                                                lat: (startLocation.lat + endLocation.lat) / 2,
                                                lng: (startLocation.lng + endLocation.lng) / 2
                                        };

                                        const distanceIcon = window.L.divIcon({
                                                className: 'distance-label',
                                                html: `<div style="background-color: white; padding: 3px 8px; border-radius: 4px; border: 1px solid #ccc; font-size: 12px;">${distanceInKm} km</div>`,
                                                iconSize: [80, 20],
                                                iconAnchor: [40, 10]
                                        });

                                        const distanceMarker = window.L.marker([midPoint.lat, midPoint.lng], {
                                                icon: distanceIcon,
                                                interactive: false
                                        }).addTo(mapInstanceRef.current);

                                        markersRef.current.push(distanceMarker);

                                        // Fit the map bounds to show both points
                                        mapInstanceRef.current.fitBounds(pathLatLngs, {
                                                padding: [50, 50]
                                        });
                                } catch (error) {
                                        console.error("Error drawing route:", error);
                                }
                        } else if (startLocation) {
                                // If only startLocation is provided, center and zoom to it
                                mapInstanceRef.current.setView([startLocation.lat, startLocation.lng], 14);
                        } else if (endLocation) {
                                // If only endLocation is provided, center and zoom to it
                                mapInstanceRef.current.setView([endLocation.lat, endLocation.lng], 14);
                        }
                };

                // Initialize or update the map
                initializeMap();

                // Cleanup function
                return () => {
                        if (mapInstanceRef.current && !startLocation && !endLocation) {
                                mapInstanceRef.current.remove();
                                mapInstanceRef.current = null;
                                markersRef.current = [];
                                routeLayerRef.current = null;
                        }
                };
        }, [startLocation, endLocation, leafletLoaded]);

        // Handle resize events to make the map responsive
        useEffect(() => {
                const handleResize = () => {
                        if (mapInstanceRef.current) {
                                mapInstanceRef.current.invalidateSize();
                        }
                };

                window.addEventListener('resize', handleResize);
                return () => window.removeEventListener('resize', handleResize);
        }, []);

        return (
                <div className="relative w-full h-full">
                        <div
                                ref={mapRef}
                                className="w-full h-full rounded-md overflow-hidden"
                                style={{ minHeight: '100%' }}
                        />
                        {distance && (
                                <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow text-sm font-medium">
                                        Distance: {distance} km
                                </div>
                        )}
                </div>
        );
}