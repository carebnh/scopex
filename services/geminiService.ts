
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "Scope X AI Advisor," a high-level specialist in hospital laboratory management and diagnostic operations across India. 
Your goal is to provide strategic consulting to hospital administrators and lab directors.

Scope X Diagnostics provides India-wide services:
1. Complete Outsource Model: Full management of setup, manpower, operations, and NABL compliance.
2. Hybrid Partnership Model: Setup and technical management (reagents/quality) while hospital manages manpower.
3. Expertise in: Lab design, automation, ISO 15189 (NABL) accreditation, and TAT optimization.

CONSULTING GUIDELINES:
- Be professional, strategic, and concise.
- Use bullet points for readability.
- When explaining complex topics, offer a "Suggested Next Step" (e.g., "We should perform a TAT audit").
- Always mention that Scope X operates across India.
- If relevant, include suggested follow-up questions at the end of your response, formatted as: 
  [SUGGESTIONS: question 1 | question 2 | question 3]
- Contact: 8889947011 or scopexdiagnostic@gmail.com.
`;

export const getLabAdvice = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The advisor is currently unavailable. Please contact us directly at 8889947011.";
  }
};
