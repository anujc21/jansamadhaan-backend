const Issue = require("../models/Issue");

module.exports = async (req, res) => {
    try {
        const headers = req.headers;

        const ulbID = headers["x-ulb-id"];

        const departmentID = headers["x-department-id"];

        const issues = await Issue.find({ ulbID, departmentID });

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
