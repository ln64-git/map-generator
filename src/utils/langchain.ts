"use server"
import { Ollama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';

const model = new Ollama({
  baseUrl: 'http://localhost:11434',
  model: 'llama3.1',
});

const model2 = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o',
});

export async function submitPromptToOllama(userPrompt: string): Promise<GeoJSON.FeatureCollection> {
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
    const response = await model2.invoke(prompt);

    // Access the content property directly
    let content = response?.lc_kwargs?.content;

    // Remove any surrounding backticks and parse the content as GeoJSONFeatureCollection
    if (content) {
      content = content.replace(/```json|```/g, '').trim();
      // Remove comments from the JSON string
      content = content.replace(/\/\/.*$/gm, '');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(content) as GeoJSON.FeatureCollection;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Invalid JSON response from the AI model.');
    }

    return parsedData;
  } catch (error) {
    console.error('Error invoking Ollama model:', error);
    throw new Error('Failed to submit prompt to Ollama.');
  }
}
