import type { QueryAnalysis } from "@/types/queryTypes";

export function analyzeQuery(query: string): QueryAnalysis {
	const lowerQuery = query.toLowerCase().trim();

	// Route detection patterns
	const routePatterns = [
		/from\s+(\w+)\s+to\s+(\w+)/i,
		/(\w+)\s+to\s+(\w+)/i,
		/route\s+from\s+(\w+)\s+to\s+(\w+)/i,
		/directions?\s+from\s+(\w+)\s+to\s+(\w+)/i,
		/path\s+from\s+(\w+)\s+to\s+(\w+)/i,
		/drive\s+from\s+(\w+)\s+to\s+(\w+)/i,
		/travel\s+from\s+(\w+)\s+to\s+(\w+)/i,
		/railway\s+route/i,
		/rail\s+route/i,
		/train\s+route/i,
		/trans.*railway/i,
		/trans.*rail/i,
	];

	// Historical event patterns
	const historicalPatterns = [
		/war\s+of\s+(\d{4})/i,
		/(\d{4})\s+war/i,
		/battle\s+of\s+(\w+)/i,
		/revolution/i,
		/civil\s+war/i,
		/world\s+war/i,
		/cold\s+war/i,
		/independence/i,
		/reconstruction/i,
		/great\s+depression/i,
		/renaissance/i,
		/medieval/i,
		/ancient/i,
		/timeline/i,
		/history/i,
		/empire\s+expansion/i,
		/roman\s+empire/i,
		/expansion/i,
		/conquest/i,
		/invasion/i,
	];

	// Network analysis patterns
	const networkPatterns = [
		/network/i,
		/trade\s+network/i,
		/drug\s+trade/i,
		/smuggling/i,
		/trafficking/i,
		/supply\s+chain/i,
		/distribution/i,
		/connections/i,
		/relationships/i,
		/infrastructure/i,
		/pipeline/i,
		/route\s+network/i,
	];

	// Geographic feature patterns
	const geographicPatterns = [
		/mountains?/i,
		/rivers?/i,
		/lakes?/i,
		/oceans?/i,
		/forests?/i,
		/deserts?/i,
		/plains?/i,
		/valleys?/i,
		/coastline/i,
		/border/i,
		/boundary/i,
		/territory/i,
		/region/i,
		/trail/i,
		/path/i,
	];

	// Trade route patterns (should be treated as network analysis)
	const tradeRoutePatterns = [
		/silk\s+road/i,
		/trade\s+route/i,
		/spice\s+route/i,
		/amber\s+route/i,
		/incense\s+route/i,
		/trade\s+network/i,
		/merchant\s+route/i,
		/caravan\s+route/i,
	];

	// Check for route queries
	for (const pattern of routePatterns) {
		if (pattern.test(lowerQuery)) {
			const entities = extractEntities(lowerQuery);
			return {
				type: "route",
				confidence: 0.9,
				entities,
				intent: "Find optimal route between locations",
				suggestedVisualization: "path",
			};
		}
	}

	// Check for historical events
	for (const pattern of historicalPatterns) {
		if (pattern.test(lowerQuery)) {
			const entities = extractEntities(lowerQuery);
			return {
				type: "historical-event",
				confidence: 0.85,
				entities,
				intent: "Visualize historical event progression",
				suggestedVisualization: "timeline",
			};
		}
	}

	// Check for trade routes (should be network analysis)
	for (const pattern of tradeRoutePatterns) {
		if (pattern.test(lowerQuery)) {
			const entities = extractEntities(lowerQuery);
			return {
				type: "network-analysis",
				confidence: 0.9,
				entities,
				intent: "Visualize historical trade networks and routes",
				suggestedVisualization: "network",
			};
		}
	}

	// Check for network analysis
	for (const pattern of networkPatterns) {
		if (pattern.test(lowerQuery)) {
			const entities = extractEntities(lowerQuery);
			return {
				type: "network-analysis",
				confidence: 0.8,
				entities,
				intent: "Analyze network connections and relationships",
				suggestedVisualization: "network",
			};
		}
	}

	// Check for geographic features
	for (const pattern of geographicPatterns) {
		if (pattern.test(lowerQuery)) {
			const entities = extractEntities(lowerQuery);
			return {
				type: "geographic-feature",
				confidence: 0.75,
				entities,
				intent: "Display geographic features and boundaries",
				suggestedVisualization: "boundaries",
			};
		}
	}

	// Default fallback
	return {
		type: "geographic-feature",
		confidence: 0.5,
		entities: extractEntities(lowerQuery),
		intent: "General geographic visualization",
		suggestedVisualization: "points",
	};
}

function extractEntities(query: string): string[] {
	// Extract potential location names, years, and key terms
	const entities: string[] = [];

	// Extract years
	const yearMatches = query.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/g);
	if (yearMatches) entities.push(...yearMatches);

	// Extract potential city/place names (simple heuristic)
	const words = query.split(/\s+/);
	const capitalizedWords = words.filter(
		(word) =>
			word.length > 2 &&
			/^[A-Z]/.test(word) &&
			![
				"The",
				"And",
				"Or",
				"But",
				"From",
				"To",
				"Of",
				"In",
				"On",
				"At",
			].includes(word),
	);
	entities.push(...capitalizedWords);

	// Extract common location indicators
	const locationIndicators = query.match(
		/\b(city|town|state|country|region|area|zone)\b/gi,
	);
	if (locationIndicators) entities.push(...locationIndicators);

	return [...new Set(entities)]; // Remove duplicates
}
