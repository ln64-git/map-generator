export type QueryType =
	| "route"
	| "historical-event"
	| "network-analysis"
	| "geographic-feature"
	| "demographic-data"
	| "economic-data"
	| "environmental-data"
	| "political-boundaries"
	| "migration-patterns"
	| "trade-routes";

export interface QueryAnalysis {
	type: QueryType;
	confidence: number;
	entities: string[];
	intent: string;
	suggestedVisualization:
		| "path"
		| "timeline"
		| "network"
		| "heatmap"
		| "boundaries"
		| "points";
}

export interface RouteQuery {
	type: "route";
	origin: string;
	destination: string;
	mode: "driving" | "walking" | "transit" | "cycling";
	preferences: string[];
	waypoints: Array<{
		name: string;
		coordinates: [number, number];
		description: string;
	}>;
	routeDescription: string;
	distance: string;
	duration: string;
}

export interface HistoricalEventQuery {
	type: "historical-event";
	event: string;
	timeRange: [number, number];
	keyLocations: string[];
	phases: Array<{
		name: string;
		startYear: number;
		endYear: number;
		description: string;
		locations: string[];
		coordinates: Array<[number, number]>;
	}>;
	summary: string;
	// Enhanced military mapping data
	battles?: Array<{
		name: string;
		date: string;
		coordinates: [number, number];
		outcome: "victory" | "defeat" | "draw";
		side: "allied" | "enemy" | "neutral";
		description: string;
		casualties?: string;
		commanders?: string[];
		strategicImportance?: string;
		battleType?: string;
	}>;
	movements?: Array<{
		name: string;
		from: [number, number];
		to: [number, number];
		route?: Array<[number, number]>;
		side: "allied" | "enemy";
		description: string;
		year: number;
		movementType?: string;
		duration?: string;
	}>;
	territories?: Array<{
		name: string;
		coordinates: Array<[number, number]>;
		side: "allied" | "enemy" | "neutral";
		description: string;
		year: number;
		controlType?: string;
	}>;
	strategicLocations?: Array<{
		name: string;
		coordinates: [number, number];
		type: string;
		side: "allied" | "enemy" | "neutral";
		importance: string;
		description: string;
		year: number;
	}>;
	supplyLines?: Array<{
		name: string;
		coordinates: Array<[number, number]>;
		side: "allied" | "enemy";
		description: string;
		year: number;
	}>;
}

export interface NetworkAnalysisQuery {
	type: "network-analysis";
	subject: string;
	nodes: Array<{
		name: string;
		type: string;
		coordinates: [number, number];
		importance: number;
		description: string;
	}>;
	connections: Array<{
		from: string;
		to: string;
		strength: number;
		type: string;
		description: string;
	}>;
	summary: string;
}

export interface GeographicFeatureQuery {
	type: "geographic-feature";
	feature: string;
	coordinates: Array<[number, number]>;
	properties: Record<string, unknown>;
}

export type ProcessedQuery =
	| RouteQuery
	| HistoricalEventQuery
	| NetworkAnalysisQuery
	| GeographicFeatureQuery;
