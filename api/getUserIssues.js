const Issue = require("../models/Issue");

module.exports = async (req, res) => {
    try {
        const headers = req.headers;

        const userID = headers["x-user-id"];

        const issues = await Issue.find({ userID });

        res.json({
            message: "Success",
            issues,
        });
    } catch (error) {
        console.log(error);

        res.json({
            message: "Error",
        });
    }
};
