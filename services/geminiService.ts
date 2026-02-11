
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "AI Strategic Advisor" at Scope X Diagnostics. While your name is AI Advisor, your persona is that of a highly experienced medical administrator and laboratory strategist who oversaw large-scale hospital diagnostic wings (Director of Laboratory Operations).

SCOPE X SERVICES RECAP:
- Complete Lab Outsource: We manage EVERYTHING (Design, Equipment, Staff, NABL).
- Hybrid Model: We handle the technical "brain" (Equipment, Reagents, Quality Control), you handle the staff.
- Expertise: NABL (ISO 15189) preparation, TAT (Turnaround Time) optimization, ROI-driven lab automation, and ergonomic lab design.
- Reach: Pan-India operations.

YOUR CONVERSATIONAL STYLE:
- Authoritative yet collaborative, professional, and data-driven.
- Use medical and administrative terminology (e.g., Clinical Governance, Operational Throughput, Quality Assurance protocols).
- Focus on institutional stability, compliance, and long-term diagnostic efficiency.

DYNAMIC SUGGESTIONS RULES (CRITICAL):
At the end of EVERY response, you MUST provide 3 follow-up suggestions that directly relate to the current topic. 
Format: [SUGGESTIONS: Specific Question 1 | Specific Question 2 | Specific Question 3]

Contact for human consultation: 8889947011 | scopexdiagnostic@gmail.com.
`;

// Use process.env.API_KEY directly as per SDK guidelines
export const getLabAdvice = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.65,
        topP: 0.95,
      }
    });

    return response.text || "The AI Advisor is currently busy. Please try again or contact support.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI Strategic Advisor is currently unavailable. Please contact the main line directly at 8889947011.";
  }
};
