"use client"

import React, { useEffect, useRef } from 'react';

export function MapComponent({ location }) {
        const mapRef = useRef(null);
        const mapInstanceRef = useRef(null);
        const markerRef = useRef(null);

        useEffect(() => {
                // Only load the map if we have a location and the mapRef is available
                if (!location || !mapRef.current) return;

                // Function to initialize or update the map
                const initializeMap = async () => {
                        // If the map script isn't loaded yet, load it
                        if (!window.L) {
                                const script = document.createElement('script');
                                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                                script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                                script.crossOrigin = '';

                                // Create and append the CSS link for Leaflet
                                const link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                                link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                                link.crossOrigin = '';

                                document.head.appendChild(link);

                                // Wait for the script to load
                                await new Promise((resolve) => {
                                        script.onload = resolve;
                                        document.head.appendChild(script);
                                });
                        }

                        // If map already exists, just update marker position
                        if (mapInstanceRef.current) {
                                if (markerRef.current) {
                                        markerRef.current.setLatLng([location.lat, location.lng]);
                                } else {
                                        markerRef.current = window.L.marker([location.lat, location.lng]).addTo(mapInstanceRef.current);
                                }
                                mapInstanceRef.current.setView([location.lat, location.lng], 13);
                                return;
                        }

                        // Initialize the map
                        mapInstanceRef.current = window.L.map(mapRef.current).setView([location.lat, location.lng], 13);

                        // Add the OpenStreetMap tile layer
                        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(mapInstanceRef.current);

                        // Add a marker for the location
                        markerRef.current = window.L.marker([location.lat, location.lng]).addTo(mapInstanceRef.current);
                };

                initializeMap();

                // Cleanup function
                return () => {
                        if (mapInstanceRef.current) {
                                // Only remove the map if we're unmounting completely, not on location updates
                                if (!location) {
                                        mapInstanceRef.current.remove();
                                        mapInstanceRef.current = null;
                                        markerRef.current = null;
                                }
                        }
                };
        }, [location]);

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
                <div
                        ref={mapRef}
                        className="w-full h-full rounded-md overflow-hidden"
                        style={{ minHeight: '100%' }}
                />
        );
}