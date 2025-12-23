## Description

An AI-powered map generator that transforms natural language prompts into interactive geographic visualizations using LangChain structured output and Mapbox 3D rendering.

## Skills / Tools / Stack

- TypeScript
- LangChain
- OpenAI API
- Next.js
- Mapbox GL JS

# Summary

Map Generator converts plain English into interactive maps. Describe a route, historical event, or trade network in natural language and watch it render as GeoJSON on a 3D globe.

The system uses LangChain with GPT-4 to parse intent and generate structured geographic data. Multi-mode prompt engineering handles different query types—routes with waypoints, historical events with battles and territorial control, network analysis with nodes and connections. Mapbox GL JS renders the output with terrain, atmospheric effects, and real-time visualization.

Built for researchers, educators, and anyone who needs geographic data without manual coordinate entry or GIS expertise.

## Features

- Natural language to GeoJSON transformation via GPT-4 structured output
- Multi-mode prompt engineering for routes, historical events, and network analysis
- 3D globe visualization with terrain rendering and atmospheric fog
- Route generation with waypoints, distance, and duration estimates
- Historical event mapping with battles, movements, territories, and strategic locations
- Network analysis with nodes, connections, and relationship strength
- Real-time rendering of generated geographic data
- JSON sanitization and error recovery for malformed AI output
- Dark-themed modern UI built with Tailwind CSS
- Next.js 14 App Router with server actions

### Roadmap

1. Add support for animated route playback
2. Implement historical timeline scrubbing for event maps
3. Build export functionality for GeoJSON and static images
4. Create preset templates for common map types
5. Add collaborative editing for shared map projects

### Instructions

1. Clone the repository and install dependencies with `bun install`
2. Create `.env` file with `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` and `OPENAI_API_KEY`
3. Start the development server with `bun run dev`
4. Open `http://localhost:3000` and enter a natural language prompt
5. View generated geographic data rendered on the 3D map

### License

Private
