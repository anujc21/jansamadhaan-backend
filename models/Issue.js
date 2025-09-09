const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    id: String,
    departmentID: String,
    ulbID: String,
    userID: String,
    photos: [String],
    username: String,
    title: String,
    description: String,
    type: String,
    location: Object,
    status: String,
    severity: String,
    issueDate: Number,
});

module.exports = mongoose.model("Issue", IssueSchema);

