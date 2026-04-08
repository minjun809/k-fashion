import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FashionRecommendation {
  brands: {
    name: string;
    description: string;
    vibe: string;
  }[];
  items: {
    name: string;
    category: string;
    description: string;
    stylingTip: string;
  }[];
  summary: string;
}

export async function getFashionRecommendations(style: string): Promise<FashionRecommendation> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Recommend fashion brands and coordination items for the following style: "${style}". 
    Provide high-end, chic recommendations. Focus on quality and aesthetic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brands: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                vibe: { type: Type.STRING },
              },
              required: ["name", "description", "vibe"],
            },
          },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                stylingTip: { type: Type.STRING },
              },
              required: ["name", "category", "description", "stylingTip"],
            },
          },
          summary: { type: Type.STRING },
        },
        required: ["brands", "items", "summary"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text);
}
