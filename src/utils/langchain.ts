"use server";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
	openAIApiKey: process.env.OPENAI_API_KEY,
	modelName: "gpt-4o",
});

export async function generateGeoJSON(
	userPrompt: string,
): Promise<GeoJSON.FeatureCollection> {
	try {
		// Modify the prompt to request JSON-only output
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

		// Access the content property from OpenAI response
		let content = response?.lc_kwargs?.content || String(response);

		// Remove any surrounding backticks and parse the content as GeoJSONFeatureCollection
		if (content) {
			content = content.replace(/```json|```/g, "").trim();
			// Remove comments from the JSON string
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
