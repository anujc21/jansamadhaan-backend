import { GoogleGenAI } from "@google/genai";
import { randomID } from "../utils.js";
import MergedIssue from "../models/MergedIssue.js";
import detectSeverity from "./detectSeverity.js";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateMergedTitle(titles, location, type) {
    const prompt = `
    The following are multiple or single user-submitted titles of civic issues related to "${type}".
    They were reported around ${location.city}, ${location.state}.
    Please combine them into a single, clear, concise, and meaningful title (5–10 words max) 
    that represents the cluster of issues.

    Titles:
    ${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.candidates[0].content.parts[0].text.trim();
}

async function generateMergedDescription(descriptions, location, type) {
    const prompt = `
    The following are multiple or single user-submitted reports of civic issues related to "${type}".
    They were reported around ${location.city}, ${location.state}.
    Please combine them into one clear, medium-sized, detailed summary (3–5 sentences).
    The summary should capture the core problem without repeating the same details.

    Reports:
    ${descriptions.map((d, i) => `${i + 1}. ${d}`).join("\n")}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.candidates[0].content.parts[0].text;
}

const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const [lat1, lon1] = coords1.split(",").map(parseFloat);
    const [lat2, lon2] = coords2.split(",").map(parseFloat);

    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export default async (issue) => {
    try {
        const mergedIssue = await MergedIssue.findOne({
            type: issue.issueType,
            departmentID: issue.departmentID,
            "location.state": issue.location.state,
            "location.city": issue.location.city,
        });

        const radius = 50;

        if (mergedIssue) {
            const distance = haversineDistance(
                issue.location.coordinates,
                mergedIssue.location.coordinates
            );

            if (distance > radius) return;

            const titles = [issue.title, mergedIssue.title];
            const descriptions = [issue.description, mergedIssue.description];

            const mergedTitle = await generateMergedTitle(
                titles,
                issue.location,
                issue.issueType
            );

            const mergedDescription = await generateMergedDescription(
                descriptions,
                issue.location,
                issue.issueType
            );

            const severity = await detectSeverity(
                mergedTitle,
                mergedDescription,
                issue.issueType
            );

            const issues = Array.from(
                new Set([...mergedIssue.issues, issue.id])
            );
            const userIDs = Array.from(
                new Set([...mergedIssue.userIDs, issue.userID])
            );
            const usernames = Array.from(
                new Set([...mergedIssue.usernames, issue.username])
            );
            const emails = Array.from(
                new Set([...mergedIssue.emails, issue.email])
            );
            const photos = Array.from(
                new Set([...mergedIssue.photos, ...issue.photos])
            );

            await MergedIssue.updateOne(
                { id: mergedIssue.id },
                {
                    $set: {
                        title: mergedTitle,
                        description: mergedDescription,
                        issues,
                        userIDs,
                        usernames,
                        emails,
                        photos,
                        severity,
                    },
                    $inc: {
                        weightage: 1,
                    },
                }
            );
        } else {
            const summarizedTitle = await generateMergedTitle(
                [issue.title],
                issue.location,
                issue.issueType
            );

            const summarizedDescription = await generateMergedDescription(
                [issue.description],
                issue.location,
                issue.issueType
            );

            await MergedIssue.insertOne({
                id: randomID(),
                issues: [issue.id],
                departmentID: issue.departmentID,
                ulbID: issue.ulbID,
                userIDs: [issue.userID],
                photos: [...issue.photos],
                usernames: [issue.username],
                emails: [issue.email],
                title: issue.title,
                description: summarizedTitle,
                type: summarizedDescription,
                location: issue.location,
                status: issue.status,
                feedback: issue.feedback,
                severity: issue.severity,
                weightage: 1,
                issueDates: [issue.issueDate],
            });
        }
    } catch (error) {
        console.log(error);
    }
};
