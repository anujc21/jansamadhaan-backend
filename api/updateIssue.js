const Issue = require("../models/Issue");

module.exports = async (req, res) => {
    try {
        const body = req.body;

        await Issue.updateOne(
            { id: body.id },
            {
                $set: {
                    status: body.status,
                    feedback: body.feedback,
                },
            }
        );

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
