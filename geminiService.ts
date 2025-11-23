import { GoogleGenAI, Type } from "@google/genai";
import { SearchResultBook } from "./types";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const searchBooksViaGemini = async (query: string): Promise<SearchResultBook[]> => {
  const ai = getAiClient();

  // We ask Gemini to act as a Douban Book search proxy.
  // It returns structured JSON data.
  const prompt = `
    Search for books related to the query: "${query}". 
    Imagine you are searching the Douban Books database.
    Return exactly 5 most relevant books.
    For the "category", choose the best fit from: [小说, 社科, 心理, 历史, 哲学, 科普, 经济, 艺术, 其他].
    For "coverUrl", since you cannot browse live images easily, return an empty string, I will handle it on the frontend.
    Provide a brief "intro" (summary).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              intro: { type: Type.STRING },
              category: { type: Type.STRING },
              // We omit coverUrl from schema to keep it simple, 
              // we will generate placeholders on the frontend based on title seed.
            },
            required: ["title", "author", "category"]
          }
        }
      }
    });

    const rawText = response.text;
    if (!rawText) return [];

    const data = JSON.parse(rawText) as SearchResultBook[];
    return data;

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};