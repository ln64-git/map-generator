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

export async function submitPromptToOllama(userPrompt: string): Promise<any> {
    try {
        // Modify the prompt to request JSON-only output
        const prompt = `Generate GeoJSON data from the following prompt: ${userPrompt}. Please respond with JSON only, without any additional text or explanation.`;
        console.log("finalPrompt: ", prompt);

        const response = await model2.invoke(prompt);

        // Access the content property directly
        const content = response?.lc_kwargs?.content;
        console.log("content: ", content);

        return content;
    } catch (error) {
        console.error('Error invoking Ollama model:', error);
        throw new Error('Failed to submit prompt to Ollama.');
    }
}
