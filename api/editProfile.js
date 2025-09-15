import User from "../models/User.js";

export default async (req, res) => {
    try {
        const body = req.body;

        const user = await User.findOneAndUpdate(
            { id: body.id },
            {
                $set: { ...body.updates, newUser: false },
            },
            { new: true }
        );

        res.json({
            message: "Success",
            user,
        });
    } catch (error) {
        console.log(error);

        res.json({
            message: "Error",
        });
    }
};
