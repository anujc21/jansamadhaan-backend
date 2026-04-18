import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
    id: String,
    departmentID: String,
    ulbID: String,
    userID: String,
    photos: [String],
    username: String,
    email: String,
    title: String,
    description: String,
    type: String,
    location: Object,
    status: String,
    feedback: String,
    severity: String,
    issueDate: Number,
    timeline: [
        {
            date: Number,
            event: String,
            type: { type: String }, // 'old' or 'new' for styling, or just semantic
            user: String, // Who performed the action
        },
    ],
});

export default mongoose.model("Issue", IssueSchema);
