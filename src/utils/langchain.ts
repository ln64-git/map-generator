"use server";
import { ChatOpenAI } from "@langchain/openai";
import type { ProcessedQuery, QueryAnalysis } from "@/types/queryTypes";

const model = new ChatOpenAI({
	openAIApiKey: process.env.OPENAI_API_KEY,
	modelName: "gpt-4o",
});

export async function generateDynamicMapData(
	userPrompt: string,
	queryAnalysis: QueryAnalysis,
): Promise<ProcessedQuery> {
	try {
		let systemPrompt = "";
		let userPromptFormatted = "";

		switch (queryAnalysis.type) {
			case "route":
				systemPrompt = `You are a routing expert specializing in both road routes and railway routes. Generate detailed route information between locations.

				IMPORTANT: Use the EXACT cities mentioned in the user's request. Do not substitute with nearby cities.
				For coordinates, use accurate longitude/latitude values for the specific cities mentioned.
				
				CRITICAL: The waypoints array MUST include the origin city as the FIRST waypoint and destination city as the LAST waypoint.
				
				For railway routes (like Trans-Siberian Railway), include major cities along the route:
				- Moscow (start)
				- Yekaterinburg
				- Novosibirsk
				- Krasnoyarsk
				- Irkutsk
				- Ulan-Ude
				- Vladivostok (end)
				
				CRITICAL JSON FORMATTING RULES:
				- NO trailing commas in arrays or objects
				- NO comments in the JSON
				- Ensure all brackets and braces are properly closed
				- Use only valid JSON syntax
				- Return ONLY the JSON object, no explanatory text before or after
				
				Return ONLY valid JSON in this exact format:
				{
					"type": "route",
					"origin": "City, State/Country",
					"destination": "City, State/Country", 
					"mode": "driving|railway|walking|transit|cycling",
					"preferences": ["scenic", "fastest"],
					"waypoints": [
						{"name": "Origin City", "coordinates": [longitude, latitude], "description": "Starting point"},
						{"name": "Major City", "coordinates": [longitude, latitude], "description": "Major waypoint"},
						{"name": "Destination City", "coordinates": [longitude, latitude], "description": "Final destination"}
					],
					"routeDescription": "Brief description of the route",
					"distance": "X miles",
					"duration": "X hours"
				}`;
				userPromptFormatted = `Find the best route for: ${userPrompt}. Use the EXACT cities mentioned - do not substitute with nearby cities. For railway routes, include major cities along the route.`;
				break;

			case "historical-event":
				systemPrompt = `You are a military historian and cartographer specializing in creating comprehensive historical battle maps. Generate detailed military map data for historical events with maximum accuracy and visual effectiveness.

				CRITICAL REQUIREMENTS FOR EFFECTIVE VISUALIZATION:
				1. TERRITORIAL CONTROL: Generate detailed polygon coordinates for ALL nations/entities involved showing their actual territorial boundaries during this period
				2. CAMPAIGN MOVEMENTS: Create realistic movement paths following actual historical routes (rivers, roads, strategic paths) - NOT straight lines
				3. STRATEGIC INFRASTRUCTURE: Include forts, cities, ports, supply depots, and key geographic features
				4. BATTLE PROGRESSION: Show battle sequences, sieges, and strategic importance
				5. TEMPORAL LAYERS: Include how territorial control changed over time
				6. HISTORICAL CONTEXT: Provide rich historical details for educational value

				SPECIAL INSTRUCTIONS FOR EMPIRE EXPANSION (like Roman Empire):
				- Show territorial expansion phases over time (not linear routes)
				- Include major conquests, battles, and territorial acquisitions
				- Display Roman territories as filled polygons with accurate historical boundaries
				- Show expansion movements as arrows/vectors from Rome outward
				- Include key cities, provinces, and administrative centers
				- Represent different phases: Republic expansion, Imperial expansion, etc.

				IMPORTANT: For territorial boundaries, provide realistic polygon coordinates that follow actual geographic features like coastlines, rivers, and mountain ranges. Avoid simple rectangular shapes - use detailed coordinate arrays that represent the true shape of historical territories.

				CRITICAL JSON FORMATTING RULES:
				- NO trailing commas in arrays or objects
				- NO comments in the JSON
				- Ensure all brackets and braces are properly closed
				- Use only valid JSON syntax
				- Return ONLY the JSON object, no explanatory text before or after

				Return ONLY valid JSON in this exact format:
				{
					"type": "historical-event",
					"event": "Event Name",
					"timeRange": [startYear, endYear],
					"keyLocations": ["Location1", "Location2"],
					"phases": [
						{
							"name": "Phase Name",
							"startYear": year,
							"endYear": year,
							"description": "What happened in this phase",
							"locations": ["Location1", "Location2"],
							"coordinates": [[lng, lat], [lng, lat]]
						}
					],
					"summary": "Brief historical summary",
					"battles": [
						{
							"name": "Battle Name",
							"date": "Month Day, Year",
							"coordinates": [lng, lat],
							"outcome": "victory|defeat|draw",
							"side": "allied|enemy|neutral",
							"description": "Detailed battle description",
							"casualties": "X killed, Y wounded",
							"commanders": ["Commander1", "Commander2"],
							"strategicImportance": "high|medium|low",
							"battleType": "land|naval|siege|skirmish"
						}
					],
					"movements": [
						{
							"name": "Movement Name",
							"route": [[lng, lat], [lng, lat], [lng, lat]],
							"side": "allied|enemy",
							"description": "Movement description",
							"year": year,
							"movementType": "advance|retreat|supply|naval",
							"duration": "X days"
						}
					],
					"territories": [
						{
							"name": "United States",
							"coordinates": [[-95.0, 25.0], [-80.0, 25.0], [-80.0, 45.0], [-95.0, 45.0], [-95.0, 25.0]],
							"side": "allied",
							"description": "Territory controlled by the United States",
							"year": 1812,
							"controlType": "full|partial|disputed"
						},
						{
							"name": "British North America",
							"coordinates": [[-95.0, 45.0], [-60.0, 45.0], [-60.0, 70.0], [-95.0, 70.0], [-95.0, 45.0]],
							"side": "enemy",
							"description": "British colonial territories in North America",
							"year": 1812,
							"controlType": "full"
						}
					],
					"strategicLocations": [
						{
							"name": "Fort Name",
							"coordinates": [lng, lat],
							"type": "fort|city|port|supply_depot",
							"side": "allied|enemy|neutral",
							"importance": "critical|major|minor",
							"description": "Strategic importance",
							"year": 1812
						}
					],
					"supplyLines": [
						{
							"name": "Supply Route Name",
							"coordinates": [[lng, lat], [lng, lat]],
							"side": "allied|enemy",
							"description": "Supply line description",
							"year": 1812
						}
					]
				}`;
				userPromptFormatted = `Create a comprehensive, visually effective historical military map for: ${userPrompt}. 

				VISUALIZATION REQUIREMENTS FOR MAXIMUM EFFECTIVENESS:
				
				1. TERRITORIAL CONTROL MESHES:
				- Generate detailed polygon coordinates for ALL nations/entities showing their actual territorial boundaries
				- For Roman Empire expansion: Show Roman territories as filled polygons with accurate historical boundaries
				- Include conquered territories, provinces, and administrative regions
				- Show different phases of expansion (Republic vs Imperial periods)
				- Use realistic historical boundaries as they existed during each period
				
				2. REALISTIC CAMPAIGN MOVEMENTS:
				- Create movement routes that follow actual historical paths (rivers, roads, strategic corridors)
				- For Roman expansion: Show expansion vectors from Rome outward to conquered territories
				- Include naval movements along coastlines and waterways
				- Show supply lines, retreat routes, and strategic advances
				- Use multi-point routes, NOT straight lines between locations
				- Include different types: conquests, campaigns, naval expeditions
				
				3. STRATEGIC INFRASTRUCTURE OVERLAY:
				- Include all major forts, cities, ports, and supply depots
				- For Roman Empire: Include Roman cities, provincial capitals, military forts
				- Show strategic locations that influenced the expansion
				- Include geographic features that affected military operations
				- Mark supply routes and logistical networks
				
				4. COMPREHENSIVE BATTLE DATA:
				- Include 15-20 major battles/conquests with detailed information
				- Show battle progression and strategic importance
				- Include sieges, naval battles, and skirmishes
				- Provide detailed casualties, commanders, and outcomes
				- Mark battle types (land, naval, siege, skirmish)
				
				5. HISTORICAL ACCURACY:
				- Use accurate historical coordinates and realistic geographic progression
				- Include key cities, forts, rivers, and geographic features that influenced the expansion
				- Show the actual territorial control and political situation during this period
				- Focus on creating a comprehensive visual narrative that tells the complete story
				
				The goal is to create a map that effectively communicates the complexity and scope of this historical event through multiple data layers and realistic visualizations.`;
				break;

			case "network-analysis":
				systemPrompt = `You are a network analysis expert specializing in historical trade networks and complex systems. Generate detailed network data for trade routes, supply chains, and interconnected systems.

				CRITICAL REQUIREMENTS FOR EFFECTIVE VISUALIZATION:
				1. MULTIPLE NODES: Include 8-15 key cities, ports, or hubs that were central to the network
				2. STRATEGIC CONNECTIONS: Show connections between major trading centers, not just linear paths
				3. NETWORK COMPLEXITY: Represent the web-like nature of trade networks with multiple interconnected routes
				4. HISTORICAL ACCURACY: Use actual historical trading centers and their relationships
				5. GEOGRAPHIC SPREAD: Cover the full geographic extent of the network

				IMPORTANT: For trade routes like Silk Road, Spice Route, etc.:
				- Include major trading cities as nodes (Xi'an, Samarkand, Baghdad, Constantinople, etc.)
				- Show connections between these hubs with varying strengths
				- Represent different types of trade goods or routes
				- Include maritime and overland connections where applicable

				CRITICAL JSON FORMATTING RULES:
				- NO trailing commas in arrays or objects
				- NO comments in the JSON
				- Ensure all brackets and braces are properly closed
				- Use only valid JSON syntax
				- Return ONLY the JSON object, no explanatory text before or after
				
				Return ONLY valid JSON in this exact format:
				{
					"type": "network-analysis",
					"subject": "Network Subject",
					"nodes": [
						{
							"name": "City/Hub Name",
							"type": "origin|hub|destination|port|market",
							"coordinates": [longitude, latitude],
							"importance": 0.8,
							"description": "Role in the network"
						}
					],
					"connections": [
						{
							"from": "Node1",
							"to": "Node2", 
							"strength": 0.7,
							"type": "trade-route|maritime|overland|caravan",
							"description": "Connection description"
						}
					],
					"summary": "Network overview"
				}`;
				userPromptFormatted = `Analyze the network for: ${userPrompt}. 

				VISUALIZATION REQUIREMENTS FOR MAXIMUM EFFECTIVENESS:
				
				1. COMPREHENSIVE NODE COVERAGE:
				- Include 8-15 major cities, ports, or trading centers
				- Cover the full geographic extent of the network
				- Include different types of nodes (origins, hubs, destinations)
				- Show the diversity of trading centers and their roles
				
				2. REALISTIC CONNECTION NETWORK:
				- Create multiple interconnected routes, not just linear paths
				- Show varying connection strengths between nodes
				- Include different types of connections (maritime, overland, caravan)
				- Represent the web-like nature of historical trade networks
				
				3. HISTORICAL ACCURACY:
				- Use actual historical trading cities and centers
				- Include accurate geographic coordinates
				- Show realistic trade relationships and connections
				- Represent the complexity of historical trade networks
				
				The goal is to create a network visualization that accurately represents the interconnected nature of historical trade systems.`;
				break;

			default:
				systemPrompt = `You are a geographic data expert specializing in accurate trail and geographic feature mapping. Generate detailed, geographically accurate data for trails, rivers, mountain ranges, and other geographic features.

				CRITICAL REQUIREMENTS FOR ACCURATE VISUALIZATION:
				1. REALISTIC ROUTING: For trails and linear features, provide multiple waypoints that follow actual geographic paths, not straight lines
				2. GEOGRAPHIC ACCURACY: Use real coordinates that follow actual terrain, mountain ridges, valleys, and natural features
				3. DETAILED WAYPOINTS: Include 10-20+ waypoints for long trails to show realistic curves and routing
				4. HISTORICAL ACCURACY: For famous trails like Appalachian Trail, use actual trail routing through specific mountain ranges and states
				5. NATURAL FEATURES: Follow rivers, mountain ridges, valleys, and other geographic features that influence the path

				IMPORTANT: For the Appalachian Trail specifically, provide waypoints that follow the actual trail through:
				- Georgia (Springer Mountain start)
				- North Carolina/Tennessee (Great Smoky Mountains)
				- Virginia (Blue Ridge Mountains)
				- Pennsylvania (Appalachian Mountains)
				- New York (Hudson Valley)
				- Vermont/New Hampshire (Green Mountains/White Mountains)
				- Maine (Mount Katahdin end)

				CRITICAL JSON FORMATTING RULES:
				- NO trailing commas in arrays or objects
				- NO comments in the JSON
				- Ensure all brackets and braces are properly closed
				- Use only valid JSON syntax
				- Return ONLY the JSON object, no explanatory text before or after
				
				Return ONLY valid JSON in this exact format:
				{
					"type": "geographic-feature",
					"feature": "Feature Name",
					"coordinates": [[lng, lat], [lng, lat], [lng, lat], ...],
					"properties": {
						"description": "Detailed feature description",
						"area": "X sq miles or length",
						"type": "feature_type",
						"length": "X miles",
						"states": ["State1", "State2"],
						"difficulty": "easy|moderate|difficult",
						"elevation": "min-max feet"
					}
				}`;
				userPromptFormatted = `Generate geographically accurate data for: ${userPrompt}. 

				VISUALIZATION REQUIREMENTS FOR MAXIMUM ACCURACY:
				
				1. REALISTIC TRAIL ROUTING:
				- Provide 15-25 waypoints for long trails like Appalachian Trail
				- Follow actual mountain ridges, valleys, and geographic features
				- Include key landmarks, mountain peaks, and trail junctions
				- Show realistic curves and elevation changes
				
				2. GEOGRAPHIC ACCURACY:
				- Use coordinates that follow actual terrain and natural features
				- Include waypoints in each state/region the trail passes through
				- Follow rivers, mountain ranges, and other geographic boundaries
				- Show the trail's relationship to major cities and landmarks
				
				3. DETAILED PROPERTIES:
				- Include accurate length, elevation range, and difficulty
				- List all states/regions the feature passes through
				- Provide detailed description of the geographic feature
				- Include any notable landmarks or geographic characteristics
				
				The goal is to create a map that accurately represents the real-world geography and routing of this feature.`;
		}

		const response = await model.invoke(
			`${systemPrompt}\n\nUser request: ${userPromptFormatted}`,
		);

		let content = response?.lc_kwargs?.content || String(response);

		// Debug logging
		console.log("🔍 Raw AI Response:", content);
		console.log("🔍 Query Analysis:", queryAnalysis);
		console.log("🔍 User Prompt:", userPrompt);

		if (content) {
			// Extract JSON from the response - look for the first { and last }
			const jsonStart = content.indexOf("{");
			const jsonEnd = content.lastIndexOf("}");

			if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
				content = content.substring(jsonStart, jsonEnd + 1);
			}

			content = content.replace(/```json|```/g, "").trim();
			content = content.replace(/\/\/.*$/gm, "");

			// Fix common JSON issues
			content = content.replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas
			content = content.replace(/,(\s*$)/gm, ""); // Remove trailing commas at end of lines

			// Fix missing commas between properties
			content = content.replace(/"(\s*)\n(\s*)"/g, '",\n$2"'); // Add missing commas between string properties
			content = content.replace(/(\d+)(\s*)\n(\s*)"/g, '$1,\n$3"'); // Add missing commas between number and string
			content = content.replace(/(\])(\s*)\n(\s*)"/g, '$1,\n$3"'); // Add missing commas between array and string
			content = content.replace(/(\})(\s*)\n(\s*)"/g, '$1,\n$3"'); // Add missing commas between object and string

			// Fix specific patterns we're seeing in the AI output
			content = content.replace(/"(\s*)\n(\s*)\{/g, '",\n$2{'); // Add missing commas between string and object
			content = content.replace(/"(\s*)\n(\s*)\[/g, '",\n$2['); // Add missing commas between string and array
			content = content.replace(/(\d+)(\s*)\n(\s*)\{/g, "$1,\n$3{"); // Add missing commas between number and object
			content = content.replace(/(\d+)(\s*)\n(\s*)\[/g, "$1,\n$3["); // Add missing commas between number and array

			// Fix missing commas between objects in arrays (the main issue we're seeing)
			content = content.replace(/(\})(\s*)\n(\s*)\{/g, "$1,\n$3{"); // Add missing commas between objects
			content = content.replace(/(\])(\s*)\n(\s*)\{/g, "$1,\n$3{"); // Add missing commas between array and object
			content = content.replace(/(\})(\s*)\n(\s*)\[/g, "$1,\n$3["); // Add missing commas between object and array

			// Fix missing commas between array elements (like coordinates arrays)
			content = content.replace(/(\])(\s*)\n(\s*)\[/g, "$1,\n$3["); // Add missing commas between array elements
		}

		console.log("🔍 Cleaned Content:", content);

		let parsedData: ProcessedQuery;
		try {
			parsedData = JSON.parse(content) as ProcessedQuery;
			console.log("🔍 Parsed Data:", parsedData);
		} catch (error) {
			console.error("Error parsing JSON:", error);
			console.error("Raw content that failed to parse:", content);
			throw new Error("Invalid JSON response from the AI model.");
		}

		return parsedData;
	} catch (error) {
		console.error("Error invoking AI model:", error);
		throw new Error("Failed to generate map data.");
	}
}

// Legacy function for backward compatibility
export async function generateGeoJSON(
	userPrompt: string,
): Promise<GeoJSON.FeatureCollection> {
	try {
		const prompt = `
Generate GeoJSON data from the following prompt: ${userPrompt}.
The response should strictly adhere to the following JSON structure:

{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "string",
        "description": "string"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [longitude, latitude]
        ]
      }
    }
  ]
}

Please respond with JSON only, without any additional formatting text or explanation.
`;
		const response = await model.invoke(prompt);

		let content = response?.lc_kwargs?.content || String(response);

		if (content) {
			content = content.replace(/```json|```/g, "").trim();
			content = content.replace(/\/\/.*$/gm, "");
		}

		let parsedData: GeoJSON.FeatureCollection;
		try {
			parsedData = JSON.parse(content) as GeoJSON.FeatureCollection;
		} catch (error) {
			console.error("Error parsing JSON:", error);
			throw new Error("Invalid JSON response from the AI model.");
		}

		return parsedData;
	} catch (error) {
		console.error("Error invoking AI model:", error);
		throw new Error("Failed to submit prompt to AI model.");
	}
}
