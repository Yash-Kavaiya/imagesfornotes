
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VisualConcept } from "../types";

// Note: API_KEY is handled via the window.aistudio flow in App.tsx
// But we keep a helper to create the instance with the current process.env.API_KEY

export const analyzeNotes = async (notes: string): Promise<VisualConcept[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const analysisSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A short title for the concept." },
        description: { type: Type.STRING, description: "Detailed explanation." },
        imagePrompt: { type: Type.STRING, description: "Detailed visual prompt." },
      },
      required: ["title", "description", "imagePrompt"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these notes and decide on the OPTIMAL number of distinct visual concepts (between 3 and 10) to explain them.
      
      For each concept, create a prompt for a high-quality REALISTIC image.
      Style: "Professional cinematic photography, 8k resolution, highly detailed, realistic textures, natural lighting, shot on 35mm lens."
      Constraint: NO text, NO diagrams, NO labels. Purely realistic photographic representation.

      Notes: "${notes}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((item: any, index: number) => ({
      ...item,
      id: index,
    }));
  } catch (error) {
    console.error("Analysis failed", error);
    throw error;
  }
};

export const generateProImage = async (prompt: string): Promise<string> => {
  // Always create a new instance to get the latest selected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image part found");
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("KEY_RESET_REQUIRED");
    }
    throw error;
  }
};
