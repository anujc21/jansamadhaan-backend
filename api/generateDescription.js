
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default async (req, res) => {
    try {
        const { title, issueType, currentDescription, location } = req.body;

        const locationString = location ? `${location.city}, ${location.state}` : "Unknown Location";

        let prompt;
        if (currentDescription) {
            prompt = `Improve the following description for a complaint titled "${title}" related to "${issueType}" at ${locationString}. Make it professional, clear, and detailed. Current description: "${currentDescription}"`;
        } else {
            prompt = `Write a professional and detailed description for a complaint titled "${title}" related to "${issueType}" at ${locationString}. The description should explain the issue clearly. Output only the description text.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        // The structure of response in @google/genai
        const text = response.candidates[0].content.parts[0].text.trim();

        res.json({ description: text });

    } catch (error) {
        console.error("Error generating description:", error);
        res.status(500).json({ message: "Error generating description" });
    }
};
