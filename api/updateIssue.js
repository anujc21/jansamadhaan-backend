import Issue from "../models/Issue.js";
import Notification from "../models/Notification.js";
import { randomID } from "../utils.js";

export default async (req, res) => {
    try {
        const body = req.body;

        const issue = await Issue.findOne({ id: body.id });
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        const timelineEvent = {
            date: Date.now(),
            event: `Status updated to ${body.status}` + (body.feedback ? ` with feedback: ${body.feedback}` : ""),
            type: "new",
            user: "Admin",
        };

        await Issue.updateOne(
            { id: body.id },
            {
                $set: {
                    status: body.status,
                    feedback: body.feedback,
                },
                $push: { timeline: timelineEvent },
            }
        );

        // Create Notification for User
        await Notification.create({
            id: randomID(), 
            userID: issue.userID,
            title: "Issue Updated",
            message: `Your issue "${issue.title}" has been updated to ${body.status}.${body.feedback ? ` Comment: ${body.feedback}` : ""}`,
            type: "UPDATE",
            issueID: issue.id,
        });

        res.json({
            message: "Success",
        });
    } catch (error) {
        console.log(error);

        res.json({
            message: "Error",
        });
    }
};
