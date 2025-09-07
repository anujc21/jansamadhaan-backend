const Issue = require("../models/Issue");
const { randomID } = require("../utils");

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
    } catch (error) {
        console.log(error);

        res.json({
            message: "Error",
        });
    }
};
