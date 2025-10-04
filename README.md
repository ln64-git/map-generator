# Map Generator

An AI-powered map generator that transforms natural language prompts into interactive geographic visualizations using LangChain and Mapbox.

## Features

- 🗺️ **AI-Powered GeoJSON Generation** - Convert natural language descriptions into GeoJSON data using OpenAI's GPT-4 or Ollama's Llama 3.1
- 🌍 **3D Globe Visualization** - Interactive 3D globe with terrain rendering and atmospheric fog effects
- ⚡ **Real-time Rendering** - Instantly visualize generated geographic data on the map
- 🎨 **Modern UI** - Clean, dark-themed interface built with Tailwind CSS
- 🔄 **Flexible AI Backend** - Support for both cloud-based (OpenAI) and local (Ollama) AI models

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- **AI Integration**: [LangChain](https://js.langchain.com/) with OpenAI and Ollama
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ or Bun runtime
- npm, yarn, pnpm, or bun package manager

You'll also need:

- **Mapbox Account**: Get a free access token from [Mapbox](https://account.mapbox.com/access-tokens/)
- **AI Model Access**: Either
  - OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys), or
  - Local [Ollama](https://ollama.ai/) installation with llama3.1 model

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd map-generator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. (Optional) If using Ollama, make sure it's running locally:

```bash
ollama serve
ollama pull llama3.1
```

## Usage

1. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Enter a natural language prompt describing the geographic data you want to generate, for example:

   - "Draw a line from New York to Los Angeles"
   - "Create a route through the Great Lakes"
   - "Generate a path along the West Coast from Seattle to San Diego"

4. Click "Submit" and watch as the AI generates GeoJSON data and visualizes it on the map

## Project Structure

```
map-generator/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── map.tsx           # Mapbox map component
│   ├── types/
│   │   └── types.ts          # TypeScript type definitions
│   └── utils/
│       └── langchain.ts      # LangChain AI integration
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

## Configuration

### Switching AI Models

The project currently uses OpenAI's GPT-4 by default. To switch to Ollama:

1. Open `src/utils/langchain.ts`
2. Change the `model2.invoke()` call to `model.invoke()`
3. Ensure Ollama is running locally on port 11434

### Map Customization

Edit `src/components/map.tsx` to customize:

- Initial map center and zoom level
- Map style (currently using `dark-v11`)
- Terrain exaggeration
- Fog effects and atmosphere
- Line colors and widths for rendered GeoJSON

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable                          | Description                           | Required              |
| --------------------------------- | ------------------------------------- | --------------------- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox access token for map rendering | Yes                   |
| `OPENAI_API_KEY`                  | OpenAI API key for GPT-4 access       | Yes (if using OpenAI) |

## License

This project is private and not licensed for public use.

## Contributing

This is a private project. Contributions are not currently being accepted.
