"use client";
import MapComponent from "@/components/map";
import { submitPromptToOllama } from "@/utils/langchain";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [geoJsonData, setGeoJsonData] =
    useState<GeoJSONFeatureCollection | null>(null);

  async function submitPrompt() {
    try {
      const response = await submitPromptToOllama(prompt);
      setGeoJsonData(response as GeoJSONFeatureCollection);
    } catch (error) {
      console.error("Error sending prompt to OpenAI:", error);
    }
  }

  return (
    <>
      <div className="w-full flex mx-auto p-2  h-screen">
        <div className="my-2 w-1/4 flex flex-col px-2">
          <div className="my-2 text-center">Map Generator</div>
          <div className="flex-grow">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              className="my-2 p-2 w-full rounded-md"
            />
          </div>
          <button
            onClick={submitPrompt}
            className="mt-4 p-2 bg-slate-800 text-white rounded-md w-full hover:bg-slate-700"
          >
            Submit
          </button>
        </div>
        <div className="flex-grow rounded-md p-2 overflow-hidden">
          <MapComponent geoJsonData={geoJsonData} />
        </div>
      </div>
    </>
  );
}
