import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const INITIAL_CENTER: [number, number] = [-74.0242, 40.6941]; // Initial center coordinates
const INITIAL_ZOOM = 10.12;

export function MapComponent() {
    const mapRef = useRef<mapboxgl.Map | null>(null); // Ref for map instance
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // Ref for map container
    const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER); // Center state
    const [zoom, setZoom] = useState(INITIAL_ZOOM); // Zoom state

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        if (!mapboxgl.accessToken) {
            console.error('Mapbox access token is missing');
            return;
        }

        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current, // The map container
                style: 'mapbox://styles/mapbox/navigation-night-v1', // Mapbox style
                center: center,
                zoom: zoom
            });

            mapRef.current.on('move', () => {
                if (mapRef.current) {
                    const mapCenter = mapRef.current.getCenter();
                    const mapZoom = mapRef.current.getZoom();
                    setCenter([mapCenter.lng, mapCenter.lat]);
                    setZoom(mapZoom);
                }
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    return <div ref={mapContainerRef} className="w-full h-full" />;
}
