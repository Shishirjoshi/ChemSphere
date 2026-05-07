import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function askChemistryBot(prompt: string) {
  try {
    const systemPrompt = `You are "ChemSphere AI", a helpful chemistry tutor for NEB +2 students in Nepal. 
    Provide clear, accurate, and simple explanations for chemistry concepts. 
    Use examples relevant to the NEB syllabus. 
    If a student asks something unrelated to chemistry, politely redirect them back to chemistry.
    Keep answers concise. Use markdown for formulas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: systemPrompt + "\n\nUser Question: " + prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
}
