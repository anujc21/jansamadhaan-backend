import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    id: String,
    userID: String, // For citizen notifications
    departmentID: String, // For admin notifications
    ulbID: String, // For admin notifications
    title: String,
    message: String,
    type: String, // 'UPDATE', 'NEW_ISSUE', 'ACKNOWLEDGED', 'RESOLVED'
    read: { type: Boolean, default: false },
    timestamp: { type: Number, default: Date.now },
    issueID: String,
});

export default mongoose.model("Notification", NotificationSchema);
