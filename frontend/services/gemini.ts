
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseQuickTask = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse this college assignment input into a JSON object: "${input}". 
      Available Subjects: CS101, Calculus II, World History, Psychology, Chemistry.
      Available Priorities: Critical, Upcoming, Backlog.
      Current Date: Oct 24, 2023.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            estimatedHours: { type: Type.NUMBER },
            dueDate: { type: Type.STRING },
          },
          required: ["name", "category", "priority"]
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};

export const suggestTopics = async (subject: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a list of 5 key study topics or assignment sub-tasks for the college subject: "${subject}". 
      Format as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
      },
    });

    return JSON.parse(response.text.trim()) as string[];
  } catch (error) {
    console.error("Gemini Topic Suggestion Error:", error);
    return [];
  }
};
