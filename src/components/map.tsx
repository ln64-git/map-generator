"use client";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface MapComponentProps {
	geoJsonData: GeoJSONFeatureCollection | null;
}

const MapComponent = ({ geoJsonData }: MapComponentProps) => {
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const map = useRef<mapboxgl.Map | null>(null);

	useEffect(() => {
		if (map.current || !mapContainer.current) return;

		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/dark-v11",
			projection: "globe",
			zoom: 6,
			center: [-83.0007, 39.9612],
		});

		map.current.addControl(new mapboxgl.NavigationControl());

		map.current.on("style.load", () => {
			map.current?.setFog({
				range: [-1, 2],
				"horizon-blend": 0.3,
				color: "black",
				"high-color": "#090909",
				"space-color": "#0d0d0d",
				"star-intensity": 1.0,
			});

			map.current?.addSource("mapbox-dem", {
				type: "raster-dem",
				url: "mapbox://mapbox.terrain-rgb",
				tileSize: 512,
				maxzoom: 14,
			});

			map.current?.setTerrain({
				source: "mapbox-dem",
				exaggeration: 1.5,
			});
		});
	}, []);

	useEffect(() => {
		if (map.current && geoJsonData) {
			if (map.current.getSource("geojson")) {
				map.current.removeLayer("geojson-layer");
				map.current.removeSource("geojson");
			}

			map.current.addSource("geojson", {
				type: "geojson",
				data: geoJsonData as GeoJSON.FeatureCollection,
			});

			map.current.addLayer({
				id: "geojson-layer",
				type: "line",
				source: "geojson",
				layout: {},
				paint: {
					"line-color": "#4439c1",
					"line-width": 8,
				},
			});

			const bounds = new mapboxgl.LngLatBounds();
			geoJsonData.features.forEach((feature) => {
				feature.geometry.coordinates.forEach((coord) => {
					bounds.extend(coord as [number, number]);
				});
			});

			map.current.fitBounds(bounds, { padding: 20 });
		}
	}, [geoJsonData]);

	return (
		<div
			ref={mapContainer}
			className="w-full h-full"
		/>
	);
};

export default MapComponent;
