import User from "../models/User.js";
import { randomID } from "../utils.js";

export default async (req, res) => {
    try {
        const body = req.body;

        let user = await User.findOne({
            phone: body.phone,
            countryCode: body.countryCode,
        });

        if (user) {
            res.json({
                message: "Found",
                user,
            });
        } else {
            user = {
                id: randomID(),
                phone: body.phone,
                countryCode: body.countryCode,
                newUser: true,
            };

            await User.insertOne(user);

            res.json({
                message: "New",
                user,
            });
        }
    } catch (error) {
        console.log(error);

        res.json({
            message: "Error",
        });
    }
};
