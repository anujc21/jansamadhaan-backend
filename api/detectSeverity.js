import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default async (title, description, issueType) => {
    const prompt = `
        You are an expert civic issue evaluator. 

        Task:
        1. Analyze the issue's title, description, and type.
        2. Determine its severity strictly as ONE of these words: High, Medium, Low.
        3. Before answering, cross-check your reasoning 2-3 times to ensure accuracy.
        4. Do NOT output anything else—no punctuation, explanations, or extra text. ONLY output a single word.

        Title: "${title}"
        Description: "${description}"
        Type: "${issueType}"

        Output: 
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const result = response.candidates[0].content.parts[0].text.trim();

    if (["High", "Medium", "Low"].includes(result)) {
        return result;
    } else {
        console.log("AI returned invalid severity, defaulting to Medium");

        return "Medium";
    }
};
