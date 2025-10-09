"use client";
import { useId, useState } from "react";
import MapComponent from "@/components/map";
import { generateGeoJSON } from "@/utils/langchain";

export default function Home() {
	const promptId = useId();
	const [prompt, setPrompt] = useState("");
	const [geoJsonData, setGeoJsonData] =
		useState<GeoJSONFeatureCollection | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function submitPrompt() {
		if (!prompt.trim()) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await generateGeoJSON(prompt);
			setGeoJsonData(response as GeoJSONFeatureCollection);
		} catch (error) {
			console.error("Error generating GeoJSON:", error);
			setError("Failed to generate map data. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="relative h-screen bg-[#0a0a0a]">
			{/* Map takes full screen */}
			<div className="absolute inset-0">
				<MapComponent geoJsonData={geoJsonData} />
			</div>

			{/* Compact menu overlay */}
			<div className="absolute top-4 left-4 w-80 bg-[#111111]/95 backdrop-blur-sm border border-[#1f1f1f] rounded-xl shadow-2xl">
				<div className="p-4">
					<div className="mb-4">
						<h1 className="text-xl font-bold text-white">Map Generator</h1>
						<p className="text-xs text-gray-400">AI-powered geographic visualizations</p>
					</div>

					<div className="space-y-3">
						<label
							htmlFor={promptId}
							className="text-xs font-medium text-gray-300"
						>
							Describe your map
						</label>
						<textarea
							id={promptId}
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder="e.g., Draw a line from New York to Los Angeles"
							className="w-full p-3 rounded-lg text-sm leading-relaxed resize-none"
							disabled={isLoading}
							rows={3}
						/>

						{error && (
							<div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
								<p className="text-red-400 text-xs">{error}</p>
							</div>
						)}

						<button
							type="button"
							onClick={submitPrompt}
							disabled={isLoading || !prompt.trim()}
							className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
						>
							{isLoading ? (
								<span className="flex items-center justify-center gap-2">
									<svg
										className="animate-spin h-4 w-4"
										viewBox="0 0 24 24"
										aria-label="Loading"
									>
										<title>Loading</title>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Generating...
								</span>
							) : (
								"Generate Map"
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
