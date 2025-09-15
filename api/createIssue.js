import Issue from "../models/Issue.js";
import { randomID } from "../utils.js";
import mergeIssues from "./mergeIssues.js";
import submitEmail from "./submitEmail.js";
import detectSeverity from "./detectSeverity.js";
import detectSpam from "./detectSpam.js";

export default async (req, res) => {
    try {
        const body = req.body;

        const spam = await detectSpam(
            body.title,
            body.description,
            body.issueType
        );

        if (spam) {
            console.log("Spam issue detected: ", body.title);

            return res.status(400).json({
                message: "Spam issue detected",
            });
        }

        const severity = await detectSeverity(
            body.title,
            body.description,
            body.issueType
        );

        const issueObject = {
            id: randomID(),
            departmentID: body.departmentID,
            ulbID: body.ulbID,
            userID: body.userID,
            photos: body.photos,
            username: body.username,
            email: body.email,
            title: body.title,
            description: body.description,
            type: body.type,
            location: body.location,
            status: "Open",
            severity,
            issueDate: Date.now(),
        };

        await Issue.insertOne(issueObject);

        res.json({
            message: "Success",
        });

        submitEmail({
            description: body.description,
            issueType: body.issueType,
            ulb: body.ulbID,
            department: body.departmentID,
            userName: body.username,
            userEmail: body.email,
            location: body.location,
        });

        mergeIssues(issueObject);
    } catch (error) {
        console.log(error);

        res.json({
            message: "Error",
        });
    }
};
