const Issue = require("../models/Issue");
const { randomID } = require("../utils");
const submitEmail = require("./submitEmail");

module.exports = async (req, res) => {
    try {
        const body = req.body;

        await Issue.insertOne({
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
            severity: "High",
            issueDate: Date.now(),
        });

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
    } catch (error) {
        console.log(error);

        res.json({
            message: "Error",
        });
    }
};
