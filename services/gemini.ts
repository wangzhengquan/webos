import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Note: In a real production app, never expose API keys on client side if possible.
// Since this is a frontend-only demo request, we use process.env.API_KEY as instructed.

let aiClient: GoogleGenAI | null = null;

export const getAiClient = () => {
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const streamGeminiResponse = async (
  message: string,
  onChunk: (text: string) => void
) => {
  const client = getAiClient();
  if (!client) {
    onChunk("Error: API Key is missing.");
    return;
  }

  try {
    const model = 'gemini-2.5-flash';
    const streamResult = await client.models.generateContentStream({
      model,
      contents: message,
      config: {
        systemInstruction: "You are a helpful, witty, and concise AI assistant running inside a web-based simulation of macOS. Keep answers brief and helpful.",
      }
    });

    for await (const chunk of streamResult) {
      const responseChunk = chunk as GenerateContentResponse;
      if (responseChunk.text) {
        onChunk(responseChunk.text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk(`\n[Error: Failed to connect to Gemini. ${error instanceof Error ? error.message : String(error)}]`);
  }
};