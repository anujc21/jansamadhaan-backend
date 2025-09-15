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
        2. Determine if this issue is legitimate or spam/unnecessary.
        3. Internally cross-check 2-3 times to ensure your evaluation is accurate.
        4. Respond with ONLY one of these words: Spam, NotSpam. No explanations, punctuation, or extra text.

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

    if (result === "Spam") {
        return true;
    } else if (result === "NotSpam") {
        return false;
    } else {
        console.log("AI returned invalid spam evaluation, defaulting to false");

        return false;
    }
};
