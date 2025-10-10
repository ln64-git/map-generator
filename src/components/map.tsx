"use client";
import mapboxgl from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type {
	GeographicFeatureQuery,
	HistoricalEventQuery,
	NetworkAnalysisQuery,
	ProcessedQuery,
	RouteQuery,
} from "@/types/queryTypes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface MapComponentProps {
	mapData: ProcessedQuery | null;
	queryType: string;
}

const MapComponent = ({ mapData }: MapComponentProps) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
	const [currentPhase, setCurrentPhase] = useState(0);

    useEffect(() => {
		if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
			style: "mapbox://styles/mapbox/dark-v11", // Sophisticated dark theme
			projection: "mercator", // Better for historical maps
			zoom: 4,
			center: [-95.0007, 40.0000], // Centered on North America
        });

        // Removed navigation controls for cleaner appearance

		map.current.on("style.load", () => {
			// Sophisticated dark atmosphere
            map.current?.setFog({
				range: [-1, 2],
				"horizon-blend": 0.3,
				color: "#0a0a0a",
				"high-color": "#1a1a1a",
				"space-color": "#0d0d0d",
				"star-intensity": 0.8,
			});

			// Add Mapbox's built-in boundary layers for accurate nation/state borders
			// These provide much more accurate boundaries than our custom polygons
			if (map.current) {
				map.current.addSource("mapbox-boundaries", {
					type: "vector",
					url: "mapbox://mapbox.boundaries-adm0-v3"
				});

				map.current.addSource("mapbox-boundaries-admin1", {
					type: "vector", 
					url: "mapbox://mapbox.boundaries-adm1-v3"
				});

				// Add nation boundaries layer
				map.current.addLayer({
					id: "nation-boundaries",
					type: "line",
					source: "mapbox-boundaries",
					"source-layer": "boundaries_admin_0",
					paint: {
						"line-color": "#ffffff",
						"line-width": 2,
						"line-opacity": 0.8,
					},
					filter: ["==", "admin_level", 0]
				});

				// Add state/province boundaries layer
				map.current.addLayer({
					id: "state-boundaries", 
					type: "line",
					source: "mapbox-boundaries-admin1",
					"source-layer": "boundaries_admin_1",
					paint: {
						"line-color": "#cccccc",
						"line-width": 1,
						"line-opacity": 0.6,
					},
					filter: ["==", "admin_level", 1]
				});
			}

			// Add click handlers for interactive elements
			if (map.current) {
				map.current.on("click", (e) => {
					const features = map.current?.queryRenderedFeatures(e.point, {
						layers: ["historical-battles", "historical-movements", "historical-territories", "historical-strategic-locations", "historical-supply-lines", "geographic-feature-points", "network-nodes", "network-connections"]
					});

					if (features && features.length > 0) {
						const feature = features[0];
						const properties = feature.properties;
						
						if (properties) {
							console.log("🎯 Clicked Feature:", properties);
							
							// Create popup with detailed information - Sophisticated dark mode
							new mapboxgl.Popup({
								closeButton: true,
								closeOnClick: false,
								className: 'sophisticated-popup'
							})
								.setLngLat(e.lngLat)
								.setHTML(`
									<div class="p-4 text-white bg-[#111111] border border-[#333333] rounded-lg shadow-2xl max-w-sm">
										<h3 class="font-bold text-lg mb-3 text-white border-b border-[#333333] pb-2">${properties.name || 'Unknown'}</h3>
										${properties.date ? `<p class="text-sm text-gray-300 mb-2"><strong>Date:</strong> ${properties.date}</p>` : ''}
										${properties.outcome ? `<p class="text-sm mb-2"><strong>Outcome:</strong> <span class="font-semibold px-2 py-1 rounded text-xs ${properties.outcome === 'victory' ? 'bg-green-900 text-green-300' : properties.outcome === 'defeat' ? 'bg-red-900 text-red-300' : 'bg-orange-900 text-orange-300'}">${properties.outcome.toUpperCase()}</span></p>` : ''}
										${properties.side ? `<p class="text-sm mb-2"><strong>Side:</strong> <span class="font-semibold px-2 py-1 rounded text-xs ${properties.side === 'allied' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}">${properties.side.toUpperCase()}</span></p>` : ''}
										${properties.casualties ? `<p class="text-sm mb-2"><strong>Casualties:</strong> ${properties.casualties}</p>` : ''}
										${properties.commanders ? `<p class="text-sm mb-2"><strong>Commanders:</strong> ${properties.commanders.join(', ')}</p>` : ''}
										${properties.featureType === 'trail-marker' ? `<p class="text-sm mb-2"><strong>Type:</strong> <span class="font-semibold px-2 py-1 rounded text-xs bg-green-900 text-green-300">TRAIL MARKER</span></p>` : ''}
										${properties.description ? `<p class="text-sm text-gray-300 mt-3 pt-2 border-t border-[#333333]">${properties.description}</p>` : ''}
									</div>
								`)
								.addTo(map.current);
						}
					}
				});

				// Change cursor on hover for interactive elements
				const interactiveLayers = ["historical-battles", "historical-strategic-locations", "historical-supply-lines", "geographic-feature-points", "network-nodes", "network-connections"];
				
				interactiveLayers.forEach(layer => {
					map.current?.on("mouseenter", layer, () => {
						if (map.current) {
							map.current.getCanvas().style.cursor = "pointer";
						}
					});

					map.current?.on("mouseleave", layer, () => {
						if (map.current) {
							map.current.getCanvas().style.cursor = "";
						}
					});
				});
			}
        });
    }, []);

	const clearMapLayers = useCallback(() => {
		if (!map.current) return;

		const layersToRemove = [
			"route-layer",
			"route-points",
			"waypoint-labels",
			"historical-phase",
			"historical-points",
			"historical-labels",
			"historical-territories",
			"historical-territory-borders",
			"historical-movements",
			"historical-movement-arrows",
			"historical-battles",
			"historical-battle-symbols",
			"historical-strategic-locations",
			"historical-strategic-symbols",
			"historical-supply-lines",
			"network-nodes",
			"network-connections",
			"network-connections-glow",
			"network-flow-lines",
			"network-labels",
			"geographic-feature-line",
			"geographic-feature-points",
			"geographic-feature-labels",
		];

		layersToRemove.forEach((layerId) => {
			if (map.current?.getLayer(layerId)) {
				map.current.removeLayer(layerId);
			}
		});

		const sourcesToRemove = [
			"route-data",
			"waypoint-data",
			"historical-data",
			"network-data",
			"geographic-feature-data",
			"geographic-feature-markers",
		];

		sourcesToRemove.forEach((sourceId) => {
			if (map.current?.getSource(sourceId)) {
				map.current.removeSource(sourceId);
			}
		});
	}, []);

	const renderRoute = useCallback((routeData: RouteQuery) => {
		if (!map.current) return;

		console.log("🗺️ Rendering Route Data:", routeData);

		// Create route line from waypoints
		const routeCoordinates = routeData.waypoints?.map((wp) => wp.coordinates) || [];

		console.log("🗺️ Route Coordinates:", routeCoordinates);

		map.current.addSource("route-data", {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: [
					{
						type: "Feature",
						properties: {
							name: `${routeData.origin} to ${routeData.destination}`,
							description: routeData.routeDescription,
							distance: routeData.distance,
							duration: routeData.duration,
						},
						geometry: {
							type: "LineString",
							coordinates: routeCoordinates,
						},
					},
				],
			},
		});

		// Add route line layer
		map.current.addLayer({
			id: "route-layer",
			type: "line",
			source: "route-data",
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": "#6366f1",
				"line-width": 6,
				"line-opacity": 0.8,
			},
		});

		// Add waypoint markers
		if (routeData.waypoints) {
			const waypointFeatures = routeData.waypoints.map((wp) => ({
				type: "Feature" as const,
				properties: {
					name: wp.name,
					description: wp.description,
				},
				geometry: {
					type: "Point" as const,
					coordinates: wp.coordinates,
				},
			}));

			map.current.addSource("waypoint-data", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: waypointFeatures,
				},
            });

            map.current.addLayer({
				id: "route-points",
				type: "circle",
				source: "waypoint-data",
                paint: {
					"circle-color": "#f59e0b",
					"circle-radius": 8,
					"circle-stroke-width": 2,
					"circle-stroke-color": "#ffffff",
				},
			});

			// Add labels
			map.current.addLayer({
				id: "waypoint-labels",
				type: "symbol",
				source: "waypoint-data",
				layout: {
					"text-field": ["get", "name"],
					"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
					"text-offset": [0, 2],
					"text-anchor": "top",
				},
				paint: {
					"text-color": "#ffffff",
					"text-halo-color": "#000000",
					"text-halo-width": 1,
				},
			});
		}

		// Fit bounds to route
		if (routeCoordinates.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
			routeCoordinates.forEach((coord) => {
                    bounds.extend(coord as [number, number]);
                });
			map.current.fitBounds(bounds, { padding: 50 });
		}
	}, []);

	const renderHistoricalEvent = useCallback(
		(eventData: HistoricalEventQuery) => {
			if (!map.current) return;

			console.log("⚔️ Rendering Military Map Data:", eventData);

			// Render current phase
			const phase = eventData.phases[currentPhase];
			if (!phase) return;

			const allFeatures: Array<{
				type: "Feature";
				properties: Record<string, unknown>;
				geometry: {
					type: "Point" | "LineString" | "Polygon";
					coordinates: number[] | number[][] | number[][][];
				};
			}> = [];

			// 1. Render territories (mesh overlays) - Enhanced debugging
			if (eventData.territories) {
				console.log("🗺️ Processing territories:", eventData.territories.length);
				eventData.territories.forEach((territory, index) => {
					console.log(`🗺️ Territory ${index + 1}:`, territory.name, "Coordinates:", territory.coordinates.length);
					if (territory.coordinates.length >= 3) {
						allFeatures.push({
							type: "Feature",
							properties: {
								name: territory.name,
								side: territory.side,
								description: territory.description,
								year: territory.year,
								type: "territory"
							},
							geometry: {
								type: "Polygon",
								coordinates: [territory.coordinates]
							}
						});
					} else {
						console.warn("⚠️ Territory with insufficient coordinates:", territory.name);
					}
				});
			} else {
				console.warn("⚠️ No territories found in event data!");
			}

			// 2. Render troop movements (realistic campaign routes)
			if (eventData.movements) {
				console.log("🗺️ Processing movements:", eventData.movements.length);
				eventData.movements.forEach((movement) => {
					// Use route array if available, otherwise fall back to from/to
					const coordinates = movement.route || [movement.from, movement.to];
					allFeatures.push({
						type: "Feature",
						properties: {
							name: movement.name,
							side: movement.side,
							description: movement.description,
							year: movement.year,
							movementType: movement.movementType || "advance",
							duration: movement.duration,
							type: "movement"
						},
						geometry: {
							type: "LineString",
							coordinates: coordinates
						}
					});
				});
			}

			// 3. Render battles (clickable points with outcomes)
			if (eventData.battles) {
				eventData.battles.forEach((battle) => {
					allFeatures.push({
						type: "Feature",
						properties: {
							name: battle.name,
							date: battle.date,
							outcome: battle.outcome,
							side: battle.side,
							description: battle.description,
							casualties: battle.casualties,
							commanders: battle.commanders,
							type: "battle"
						},
						geometry: {
							type: "Point",
							coordinates: battle.coordinates
						}
					});
				});
			}

			// 4. Render strategic locations (forts, cities, ports)
			if (eventData.strategicLocations) {
				console.log("🗺️ Processing strategic locations:", eventData.strategicLocations.length);
				eventData.strategicLocations.forEach((location) => {
					allFeatures.push({
						type: "Feature",
						properties: {
							name: location.name,
							type: location.type,
							side: location.side,
							importance: location.importance,
							description: location.description,
							year: location.year,
							featureType: "strategic"
						},
						geometry: {
							type: "Point",
							coordinates: location.coordinates
						}
					});
				});
			}

			// 5. Render supply lines
			if (eventData.supplyLines) {
				console.log("🗺️ Processing supply lines:", eventData.supplyLines.length);
				eventData.supplyLines.forEach((supplyLine) => {
					allFeatures.push({
						type: "Feature",
						properties: {
							name: supplyLine.name,
							side: supplyLine.side,
							description: supplyLine.description,
							year: supplyLine.year,
							type: "supply"
						},
						geometry: {
							type: "LineString",
							coordinates: supplyLine.coordinates
						}
					});
				});
			}

			// 6. Add phase locations (fallback)
			if (allFeatures.length === 0 && phase.coordinates.length > 0) {
				phase.coordinates.forEach((coord, index) => {
					allFeatures.push({
						type: "Feature",
						properties: {
							name: phase.locations[index] || `Location ${index + 1}`,
							phase: phase.name,
							year: phase.startYear,
							description: phase.description,
							type: "location"
						},
						geometry: {
							type: "Point",
							coordinates: coord,
						},
					});
				});
			}

			map.current.addSource("historical-data", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: allFeatures,
				},
			});

			// Add territories using Mapbox's accurate boundary data instead of crude rectangles
			// This creates much more realistic territorial control visualization
			map.current.addLayer({
				id: "historical-territories",
				type: "fill",
				source: "mapbox-boundaries",
				"source-layer": "boundaries_admin_0",
				paint: {
					"fill-color": [
						"case",
						["==", ["get", "iso_3166_1"], "US"], "#1e40af", // Deep blue for United States
						["==", ["get", "iso_3166_1"], "CA"], "#991b1b", // Deep red for Canada (British North America)
						"#374151" // Dark gray for other territories
					],
					"fill-opacity": 0.4, // Lower opacity to show underlying map details
				},
				filter: ["in", "iso_3166_1", "US", "CA"] // Only show US and Canada for War of 1812
			});

			// Add territory borders using Mapbox's accurate boundaries
			map.current.addLayer({
				id: "historical-territory-borders",
				type: "line",
				source: "mapbox-boundaries",
				"source-layer": "boundaries_admin_0",
				paint: {
					"line-color": [
						"case",
						["==", ["get", "iso_3166_1"], "US"], "#3b82f6", // Bright blue borders for US
						["==", ["get", "iso_3166_1"], "CA"], "#ef4444", // Bright red borders for Canada
						"#6b7280" // Gray borders for others
					],
					"line-width": 3,
					"line-opacity": 0.9,
				},
				filter: ["in", "iso_3166_1", "US", "CA"]
			});

			// Add movements (campaign routes) - Enhanced with movement types
			map.current.addLayer({
				id: "historical-movements",
				type: "line",
				source: "historical-data",
				filter: ["==", ["get", "type"], "movement"],
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": [
						"case",
						["==", ["get", "side"], "allied"], "#3b82f6", // Bright blue for allied movements
						["==", ["get", "side"], "enemy"], "#ef4444", // Bright red for enemy movements
						"#f59e0b" // Orange for neutral/unknown movements
					],
					"line-width": [
						"case",
						["==", ["get", "movementType"], "naval"], 8, // Thicker for naval movements
						["==", ["get", "movementType"], "supply"], 4, // Thinner for supply lines
						["==", ["get", "movementType"], "retreat"], 5, // Medium for retreats
						6 // Default for advances
					],
					"line-opacity": 0.8,
					"line-dasharray": [
						"case",
						["==", ["get", "movementType"], "supply"], [4, 4], // Dashed for supply lines
						["==", ["get", "movementType"], "retreat"], [2, 2], // Dashed for retreats
						[0] // Solid for advances
					],
				},
			});

			// Add movement arrows - Directional indicators
			map.current.addLayer({
				id: "historical-movement-arrows",
				type: "symbol",
				source: "historical-data",
				filter: ["==", ["get", "type"], "movement"],
				layout: {
					"symbol-placement": "line",
					"symbol-spacing": 150,
					"icon-image": "arrow-right",
					"icon-size": 1.0,
					"icon-rotate": ["get", "bearing"],
				},
				paint: {
					"icon-color": [
						"case",
						["==", ["get", "side"], "allied"], "#3b82f6",
						["==", ["get", "side"], "enemy"], "#ef4444",
						"#f59e0b"
					],
					"icon-opacity": 0.9,
				},
			});

			// Add battle markers - Sophisticated dark mode
			map.current.addLayer({
				id: "historical-battles",
				type: "circle",
				source: "historical-data",
				filter: ["==", ["get", "type"], "battle"],
				paint: {
					"circle-color": [
						"case",
						["==", ["get", "outcome"], "victory"], "#10b981", // Bright green
						["==", ["get", "outcome"], "defeat"], "#ef4444", // Bright red
						"#f59e0b" // Bright orange
					],
					"circle-radius": [
						"case",
						["==", ["get", "outcome"], "victory"], 15,
						["==", ["get", "outcome"], "defeat"], 15,
						12
					],
					"circle-stroke-width": 4,
					"circle-stroke-color": "#ffffff",
				},
			});

			// Add battle symbols - More sophisticated military symbols
			map.current.addLayer({
				id: "historical-battle-symbols",
				type: "symbol",
				source: "historical-data",
				filter: ["==", ["get", "type"], "battle"],
				layout: {
					"text-field": [
						"case",
						["==", ["get", "outcome"], "victory"], "✓",
						["==", ["get", "outcome"], "defeat"], "✗",
						"⚔"
					],
					"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
					"text-size": 18,
					"text-anchor": "center",
				},
				paint: {
					"text-color": "#ffffff",
					"text-halo-color": "#000000",
					"text-halo-width": 2,
				},
			});

			// Add strategic locations (forts, cities, ports) - Historical context
			map.current.addLayer({
				id: "historical-strategic-locations",
				type: "circle",
				source: "historical-data",
				filter: ["==", ["get", "type"], "strategic"],
				paint: {
					"circle-color": [
						"case",
						["==", ["get", "side"], "allied"], "#3b82f6", // Blue for allied strategic locations
						["==", ["get", "side"], "enemy"], "#ef4444", // Red for enemy strategic locations
						"#6b7280" // Gray for neutral strategic locations
					],
					"circle-radius": [
						"case",
						["==", ["get", "importance"], "major"], 12, // Larger for major strategic locations
						["==", ["get", "importance"], "minor"], 8,
						10
					],
					"circle-stroke-width": 2,
					"circle-stroke-color": "#ffffff",
					"circle-opacity": 0.8,
				},
			});

			// Add supply lines - Distinct from movements
			map.current.addLayer({
				id: "historical-supply-lines",
				type: "line",
				source: "historical-data",
				filter: ["==", ["get", "type"], "supply"],
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": [
						"case",
						["==", ["get", "side"], "allied"], "#60a5fa", // Lighter blue for supply lines
						["==", ["get", "side"], "enemy"], "#f87171", // Lighter red for supply lines
						"#fbbf24" // Light orange
					],
					"line-width": 3,
					"line-opacity": 0.6,
					"line-dasharray": [6, 6], // Dashed for supply lines
				},
			});

			// Add labels for battles and locations - Sophisticated dark mode
			map.current.addLayer({
				id: "historical-labels",
				type: "symbol",
				source: "historical-data",
				filter: ["in", ["get", "type"], ["literal", ["battle", "location", "strategic"]]],
				layout: {
					"text-field": ["get", "name"],
					"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
					"text-offset": [0, 2.5],
					"text-anchor": "top",
					"text-size": [
						"case",
						["==", ["get", "type"], "battle"], 14, // Larger text for battles
						["==", ["get", "type"], "strategic"], 12, // Medium text for strategic locations
						10 // Smaller text for general locations
					],
				},
				paint: {
					"text-color": "#ffffff", // White text for dark background
					"text-halo-color": "#000000",
					"text-halo-width": 3,
				},
			});

			// Fit bounds
			if (allFeatures.length > 0) {
				const bounds = new mapboxgl.LngLatBounds();
				allFeatures.forEach((feature) => {
					if (feature.geometry.type === "Point") {
						bounds.extend(feature.geometry.coordinates as [number, number]);
					} else if (feature.geometry.type === "LineString") {
						feature.geometry.coordinates.forEach((coord: [number, number]) => {
							bounds.extend(coord);
						});
					} else if (feature.geometry.type === "Polygon") {
						feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
							bounds.extend(coord);
						});
					}
				});
				map.current.fitBounds(bounds, { padding: 50 });
			}
		},
		[currentPhase],
	);

	const renderNetworkAnalysis = useCallback(
		(networkData: NetworkAnalysisQuery) => {
			if (!map.current) return;

			// Create node features
			const nodeFeatures = networkData.nodes.map((node) => ({
				type: "Feature" as const,
				properties: {
					name: node.name,
					type: node.type,
					importance: node.importance,
					description: node.description,
				},
				geometry: {
					type: "Point" as const,
					coordinates: node.coordinates,
				},
			}));

			// Create connection features
			const connectionFeatures = networkData.connections
				.map((conn) => {
					const fromNode = networkData.nodes.find((n) => n.name === conn.from);
					const toNode = networkData.nodes.find((n) => n.name === conn.to);

					if (!fromNode || !toNode) return null;

					return {
						type: "Feature" as const,
						properties: {
							strength: conn.strength,
							type: conn.type,
							description: conn.description,
						},
						geometry: {
							type: "LineString" as const,
							coordinates: [fromNode.coordinates, toNode.coordinates],
						},
					};
				})
				.filter(
					(feature): feature is NonNullable<typeof feature> => feature !== null,
				);

			map.current.addSource("network-data", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: [...nodeFeatures, ...connectionFeatures],
				},
			});

			// Add connections first (so they appear behind nodes) - Enhanced visibility
			map.current.addLayer({
				id: "network-connections",
				type: "line",
				source: "network-data",
				filter: ["==", ["geometry-type"], "LineString"],
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": [
						"case",
						["==", ["get", "type"], "maritime"], "#3b82f6", // Bright blue for maritime routes
						["==", ["get", "type"], "overland"], "#10b981", // Bright green for overland routes
						["==", ["get", "type"], "caravan"], "#f59e0b", // Bright orange for caravan routes
						["==", ["get", "type"], "trade-route"], "#8b5cf6", // Bright purple for general trade routes
						"#6b7280" // Gray for other connections
					],
					"line-width": [
						"interpolate",
						["linear"],
						["get", "strength"],
						0,
						6, // Much thicker minimum width
						1,
						16, // Much thicker maximum width
					],
					"line-opacity": 0.9, // Higher opacity for better visibility
					"line-dasharray": [
						"case",
						["==", ["get", "type"], "maritime"], [8, 4], // More prominent dashed pattern
						[0] // Solid for others
					],
				},
			});

			// Add a subtle glow effect to connections for better visibility
			map.current.addLayer({
				id: "network-connections-glow",
				type: "line",
				source: "network-data",
				filter: ["==", ["geometry-type"], "LineString"],
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": [
						"case",
						["==", ["get", "type"], "maritime"], "#3b82f6", // Blue glow
						["==", ["get", "type"], "overland"], "#10b981", // Green glow
						["==", ["get", "type"], "caravan"], "#f59e0b", // Orange glow
						["==", ["get", "type"], "trade-route"], "#8b5cf6", // Purple glow
						"#6b7280" // Gray glow
					],
					"line-width": [
						"interpolate",
						["linear"],
						["get", "strength"],
						0,
						12, // Glow is wider than main line
						1,
						24, // Glow is wider than main line
					],
					"line-opacity": 0.3, // Subtle glow effect
					"line-dasharray": [
						"case",
						["==", ["get", "type"], "maritime"], [8, 4], // Dashed glow
						[0] // Solid glow
					],
				},
			});

			// Add animated flow lines to show trade movement
			map.current.addLayer({
				id: "network-flow-lines",
				type: "line",
				source: "network-data",
				filter: ["==", ["geometry-type"], "LineString"],
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": [
						"case",
						["==", ["get", "type"], "maritime"], "#60a5fa", // Lighter blue for flow
						["==", ["get", "type"], "overland"], "#34d399", // Lighter green for flow
						["==", ["get", "type"], "caravan"], "#fbbf24", // Lighter orange for flow
						["==", ["get", "type"], "trade-route"], "#a78bfa", // Lighter purple for flow
						"#9ca3af" // Light gray for flow
					],
					"line-width": [
						"interpolate",
						["linear"],
						["get", "strength"],
						0,
						3, // Thinner flow lines
						1,
						8, // Thicker flow lines
					],
					"line-opacity": 0.6,
					"line-dasharray": [
						"case",
						["==", ["get", "type"], "maritime"], [20, 10], // Longer dashes for maritime flow
						[15, 5] // Shorter dashes for other flows
					],
				},
			});

			// Add nodes
			map.current.addLayer({
				id: "network-nodes",
				type: "circle",
				source: "network-data",
				filter: ["==", ["geometry-type"], "Point"],
				paint: {
					"circle-color": [
						"case",
						["==", ["get", "type"], "origin"], "#ef4444", // Red for origins
						["==", ["get", "type"], "hub"], "#f59e0b", // Orange for hubs
						["==", ["get", "type"], "destination"], "#3b82f6", // Blue for destinations
						["==", ["get", "type"], "port"], "#10b981", // Green for ports
						["==", ["get", "type"], "market"], "#8b5cf6", // Purple for markets
						"#6b7280" // Gray for others
					],
					"circle-radius": [
						"interpolate",
						["linear"],
						["get", "importance"],
						0,
						4,
						1,
						10,
					],
					"circle-stroke-width": 2,
					"circle-stroke-color": "#ffffff",
				},
			});

			// Add labels
			map.current.addLayer({
				id: "network-labels",
				type: "symbol",
				source: "network-data",
				filter: ["==", ["geometry-type"], "Point"],
				layout: {
					"text-field": ["get", "name"],
					"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
					"text-offset": [0, 2],
					"text-anchor": "top",
				},
				paint: {
					"text-color": "#ffffff",
					"text-halo-color": "#000000",
					"text-halo-width": 1,
				},
			});

			// Fit bounds
			if (networkData.nodes.length > 0) {
				const bounds = new mapboxgl.LngLatBounds();
				networkData.nodes.forEach((node) => {
					bounds.extend(node.coordinates as [number, number]);
				});
				map.current.fitBounds(bounds, { padding: 50 });
			}
		},
		[],
	);

	const renderGeographicFeature = useCallback((data: GeographicFeatureQuery) => {
		if (!map.current) return;

		console.log("🏔️ Rendering Geographic Feature:", data);

		// Create a line feature for the trail
		const feature = {
			type: "Feature" as const,
			properties: {
				name: data.feature,
				description: data.properties.description,
				type: data.properties.type,
				area: data.properties.area,
			},
			geometry: {
				type: "LineString" as const,
				coordinates: data.coordinates,
			},
		};

		map.current.addSource("geographic-feature-data", {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: [feature],
			},
		});

		// Add the trail line
		map.current.addLayer({
			id: "geographic-feature-line",
			type: "line",
			source: "geographic-feature-data",
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": "#10b981", // Green for trails
				"line-width": 4,
				"line-opacity": 0.8,
			},
		});

		// Add trail markers at start and end points
		const markers = data.coordinates.map((coord, index) => ({
			type: "Feature" as const,
			properties: {
				name: index === 0 ? "Start" : index === data.coordinates.length - 1 ? "End" : `Waypoint ${index + 1}`,
				description: index === 0 ? "Starting point" : index === data.coordinates.length - 1 ? "Ending point" : "Trail waypoint",
				featureType: "trail-marker",
			},
			geometry: {
				type: "Point" as const,
				coordinates: coord,
			},
		}));

		map.current.addSource("geographic-feature-markers", {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: markers,
			},
		});

		map.current.addLayer({
			id: "geographic-feature-points",
			type: "circle",
			source: "geographic-feature-markers",
			paint: {
				"circle-color": [
					"case",
					["==", ["get", "featureType"], "trail-marker"],
					"#10b981", // Green for trail markers
					"#10b981" // Default green
				],
				"circle-radius": [
					"case",
					["==", ["get", "name"], "Start"], 10, // Larger for start
					["==", ["get", "name"], "End"], 10, // Larger for end
					6 // Smaller for waypoints
				],
				"circle-stroke-width": [
					"case",
					["==", ["get", "name"], "Start"], 3, // Thicker border for start
					["==", ["get", "name"], "End"], 3, // Thicker border for end
					2 // Normal border for waypoints
				],
				"circle-stroke-color": "#ffffff",
			},
		});

		// Add labels (only for start and end points to avoid clutter)
		map.current.addLayer({
			id: "geographic-feature-labels",
			type: "symbol",
			source: "geographic-feature-markers",
			filter: ["in", ["get", "name"], ["literal", ["Start", "End"]]],
			layout: {
				"text-field": ["get", "name"],
				"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
				"text-offset": [0, 2.5],
				"text-anchor": "top",
				"text-size": 12,
			},
			paint: {
				"text-color": "#ffffff",
				"text-halo-color": "#000000",
				"text-halo-width": 2,
			},
		});

		// Fit bounds to the trail
		if (data.coordinates.length > 0) {
			const bounds = new mapboxgl.LngLatBounds();
			data.coordinates.forEach((coord) => {
				bounds.extend(coord as [number, number]);
			});
			map.current.fitBounds(bounds, { padding: 50 });
		}
	}, []);

	const renderGenericData = useCallback((data: ProcessedQuery) => {
		// Fallback rendering for other data types
		console.log("Rendering generic data:", data);
	}, []);

	useEffect(() => {
		if (!map.current || !mapData) return;

		// Clear existing layers
		clearMapLayers();

		switch (mapData.type) {
			case "route":
				renderRoute(mapData as RouteQuery);
				break;
			case "historical-event":
				renderHistoricalEvent(mapData as HistoricalEventQuery);
				break;
			case "network-analysis":
				renderNetworkAnalysis(mapData as NetworkAnalysisQuery);
				break;
			case "geographic-feature":
				renderGeographicFeature(mapData as GeographicFeatureQuery);
				break;
			default:
				renderGenericData(mapData);
		}
	}, [
		mapData,
		clearMapLayers,
		renderRoute,
		renderHistoricalEvent,
		renderNetworkAnalysis,
		renderGeographicFeature,
		renderGenericData,
	]);

	return (
		<div className="relative w-full h-full">
			<div ref={mapContainer} className="w-full h-full" />

			{/* Historical event timeline controls */}
			{mapData?.type === "historical-event" && (
				<div className="absolute bottom-4 left-4 bg-[#111111]/95 backdrop-blur-sm border border-[#1f1f1f] rounded-lg p-4">
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
							disabled={currentPhase === 0}
							className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:opacity-50 text-white text-sm rounded"
						>
							← Previous
						</button>

						<div className="text-center">
							<div className="text-white font-medium">
								{(mapData as HistoricalEventQuery).phases[currentPhase]?.name}
							</div>
							<div className="text-gray-400 text-xs">
								{
									(mapData as HistoricalEventQuery).phases[currentPhase]
										?.startYear
								}{" "}
								-
								{
									(mapData as HistoricalEventQuery).phases[currentPhase]
										?.endYear
								}
							</div>
						</div>

						<button
							type="button"
							onClick={() =>
								setCurrentPhase(
									Math.min(
										(mapData as HistoricalEventQuery).phases.length - 1,
										currentPhase + 1,
									),
								)
							}
							disabled={
								currentPhase ===
								(mapData as HistoricalEventQuery).phases.length - 1
							}
							className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:opacity-50 text-white text-sm rounded"
						>
							Next →
						</button>
					</div>
				</div>
			)}


			{/* Enhanced Historical Map Legend with Boundary Controls */}
			{mapData?.type === "historical-event" && (
				<div className="absolute top-4 right-4 bg-[#111111]/95 backdrop-blur-sm border border-[#333333] rounded-lg p-4 w-80 shadow-2xl">
					<h3 className="text-white font-bold text-base mb-3 border-b border-[#333333] pb-2">Historical Map Legend</h3>
					
					{/* Boundary Controls */}
					<div className="mb-4">
						<div className="text-gray-300 text-xs font-semibold mb-2">BOUNDARY DISPLAY</div>
						<div className="space-y-2">
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" defaultChecked className="rounded" />
								<span className="text-white text-sm">Accurate Nation Borders</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" defaultChecked className="rounded" />
								<span className="text-white text-sm">State/Province Borders</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" className="rounded" />
								<span className="text-white text-sm">Historical Territories</span>
							</label>
						</div>
					</div>
					
					<div className="space-y-3 text-sm">
						{/* Battle Outcomes */}
						<div className="text-gray-300 text-xs font-semibold mb-2">BATTLE OUTCOMES</div>
						<div className="flex items-center gap-3">
							<div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
								<span className="text-white text-xs font-bold">✓</span>
							</div>
							<span className="text-white font-medium">Victory</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
								<span className="text-white text-xs font-bold">✗</span>
							</div>
							<span className="text-white font-medium">Defeat</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
								<span className="text-white text-xs">⚔</span>
							</div>
							<span className="text-white font-medium">Draw/Unknown</span>
						</div>

						{/* Strategic Locations */}
						<div className="text-gray-300 text-xs font-semibold mb-2 mt-4">STRATEGIC LOCATIONS</div>
						<div className="flex items-center gap-3">
							<span className="text-white text-lg">🏰</span>
							<span className="text-white font-medium">Fort</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-white text-lg">⚓</span>
							<span className="text-white font-medium">Port</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-white text-lg">🏛️</span>
							<span className="text-white font-medium">City</span>
						</div>

						{/* Movements */}
						<div className="text-gray-300 text-xs font-semibold mb-2 mt-4">CAMPAIGN MOVEMENTS</div>
						<div className="flex items-center gap-3">
							<div className="w-8 h-2 bg-blue-500 rounded"></div>
							<span className="text-white font-medium">Allied Campaign</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-8 h-2 bg-red-500 rounded"></div>
							<span className="text-white font-medium">Enemy Campaign</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-8 h-1 bg-blue-500 rounded border-dashed border-2 border-blue-500"></div>
							<span className="text-white font-medium">Supply Lines</span>
						</div>

						{/* Territories */}
						<div className="text-gray-300 text-xs font-semibold mb-2 mt-4">TERRITORIAL CONTROL</div>
						<div className="flex items-center gap-3">
							<div className="w-5 h-5 bg-blue-900/40 border-2 border-blue-500"></div>
							<span className="text-white font-medium">United States</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-5 h-5 bg-red-900/40 border-2 border-red-500"></div>
							<span className="text-white font-medium">British North America</span>
						</div>

						<div className="text-gray-400 mt-4 pt-2 border-t border-[#333333] text-xs">
							💡 Click on battles and locations for detailed information
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MapComponent;
