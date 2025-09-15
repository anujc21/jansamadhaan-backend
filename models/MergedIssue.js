import mongoose from "mongoose";

const MergedIssueSchema = new mongoose.Schema({
    id: String,
    issues: [String],
    departmentID: String,
    ulbID: String,
    userIDs: [String],
    photos: [String],
    usernames: [String],
    emails: [String],
    title: String,
    description: String,
    type: String,
    location: Object,
    status: String,
    feedback: String,
    severity: String,
    weightage: Number,
    issueDates: [Number],
});

export default mongoose.model("MergedIssue", MergedIssueSchema);
