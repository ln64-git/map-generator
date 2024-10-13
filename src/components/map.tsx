// components/Map.tsx
"use client"
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoib3JwaGV1c3R3aW4iLCJhIjoiY20yN2NubHFiMGh5ZjJxb2s4NHc3aXlpNSJ9.Z005yAlm-EZ0_B8ypOp9fw';

const Map = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    const secondsPerRevolution = 240;
    let userInteracting = false;
    const spinEnabled = true;

    useEffect(() => {
        if (map.current || !mapContainer.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/standard-satellite',
            projection: 'globe', // Display the map as a globe
            zoom: 1,
            center: [30, 15],
        });

        map.current.addControl(new mapboxgl.NavigationControl());

        // Scroll zoom is enabled by default, but you can fine-tune it
        map.current.scrollZoom.enable();  // Enable scroll to zoom

        // Optional: Adjust scroll zoom speed if desired
        map.current.scrollZoom.setWheelZoomRate(1.5); // Controls zoom sensitivity

        map.current.on('style.load', () => {
            map.current?.setFog({}); // Set the default atmosphere style
        });

        const spinGlobe = () => {
            const zoom = map.current?.getZoom() || 0;
            if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
                let distancePerSecond = 360 / secondsPerRevolution;
                if (zoom > slowSpinZoom) {
                    const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                    distancePerSecond *= zoomDif;
                }
                const center = map.current?.getCenter();
                if (center) {
                    center.lng -= distancePerSecond;
                    map.current?.easeTo({ center, duration: 1000, easing: (n) => n });
                }
            }
        };

        map.current.on('mousedown', () => {
            userInteracting = true;
        });
        map.current.on('dragstart', () => {
            userInteracting = true;
        });
        map.current.on('moveend', () => {
            spinGlobe();
        });

        spinGlobe();
    }, []);

    return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
