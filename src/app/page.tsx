"use client";
import { MapComponent } from '@/components/map';

export default function Home() {
  return (
    <>
      <div className="w-full max-w-md mx-auto p-4 min-h-screen flex flex-col">
        <div className="pb-3">
          <div>Map Generator</div>
          <div>
            <input
              type="text"
              placeholder="Enter your prompt"
              className="mt-2 p-2 border rounded-md w-full"
            />
          </div>
        </div>

        <div className="flex-grow rounded-md bg-red p-2" >
          <MapComponent />
        </div>
      </div>
    </>
  );
}
