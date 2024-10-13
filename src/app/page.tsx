"use client";

import MapComponent from "@/components/map";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-md mx-auto p-4 h-screen flex flex-col">
        {/* Header Section */}
        <div className="pb-3 flex-none">
          <div>Map Generator</div>
          <div>
            <input
              type="text"
              placeholder="Enter your prompt"
              className="mt-2 p-2 border rounded-md w-full"
            />
          </div>
        </div>

        {/* Map Section - Flex grow to take available space */}
        <div className="flex-grow rounded-md p-2 overflow-hidden">
          <MapComponent />
        </div>
      </div>
    </>
  );
}
