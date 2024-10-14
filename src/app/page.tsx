"use client"
import MapComponent from "@/components/map";
import { submitPromptToOllama } from "@/utils/langchain";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  async function submitPrompt() {
    try {
      const response = await submitPromptToOllama(prompt);
      console.log("response: ", response);
    } catch (error) {
      console.error("Error sending prompt to OpenAI:", error);
    }
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto p-4 h-screen flex flex-col">
        <div className="pb-3 flex-none">
          <div>Map Generator</div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="mt-2 p-2 border rounded-md w-full"
          />
          <button
            onClick={submitPrompt}
            className="mt-4 p-2 bg-slate-800 text-white rounded-md w-full hover:bg-slate-700"
          >
            Submit
          </button>
        </div>
        <div className="flex-grow rounded-md p-2 overflow-hidden">
          <MapComponent />
        </div>
      </div>
    </>
  );
}
