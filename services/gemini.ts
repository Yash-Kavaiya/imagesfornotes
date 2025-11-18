import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VisualConcept } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for the analysis step
const analysisSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A short, catchy title for the visual concept (2-4 words)." },
      description: { type: Type.STRING, description: "A brief explanation of what this visual represents relative to the notes." },
      imagePrompt: { type: Type.STRING, description: "A highly detailed visual description for an image generator. Focus on physical objects, lighting, and composition. DO NOT include requests for text or labels inside the image." },
    },
    required: ["title", "description", "imagePrompt"],
  },
};

export const analyzeNotes = async (notes: string): Promise<VisualConcept[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following text notes. Break down the key concepts into exactly 6 distinct visual ideas that would help explain these notes.
      
      If the text is short, creatively expand on the implied themes to ensure 6 distinct concepts are generated.

      For each concept, provide:
      1. A short title.
      2. A brief description.
      3. A detailed image generation prompt. 
         Style Guide: "High-fidelity 3D isometric render, soft studio lighting, matte aesthetic, vibrant colors, clean background."
         Constraint: Do NOT describe text, letters, or diagrams containing words. The image should be purely symbolic or representational.
      
      Text Notes:
      "${notes}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    let data;
    try {
      data = JSON.parse(response.text);
    } catch (e) {
      console.error("JSON Parse Error", response.text);
      throw new Error("Failed to parse AI response");
    }
    
    // Handle potential wrapping in response
    const items = Array.isArray(data) ? data : (data.items || []);

    // Ensure we have IDs
    return items.map((item: any, index: number) => ({
      title: item.title || `Concept ${index + 1}`,
      description: item.description || "Visual explanation",
      imagePrompt: item.imagePrompt || "A nice visual representation",
      id: index,
    })).slice(0, 6);

  } catch (error) {
    console.error("Error analyzing notes:", error);
    throw error;
  }
};

export const generateImageForConcept = async (prompt: string): Promise<string> => {
  try {
    // Using imagen-4.0-generate-001 for high quality visuals
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3', 
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("No image generated");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};