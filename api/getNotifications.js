import Notification from "../models/Notification.js";

export default async (req, res) => {
    try {
        const { userID, departmentID, ulbID } = req.query;
        let query = {};

        if (userID) {
            query.userID = userID;
        } else if (departmentID) { 
            // Admin logic: fetch by department and logic
            // Add ulbID filter if present
            query.departmentID = departmentID;
            if(ulbID) query.ulbID = ulbID;
        } else {
            return res.status(400).json({ message: "Missing userID or departmentID" });
        }

        const notifications = await Notification.find(query).sort({ timestamp: -1 });

        res.json({ notifications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching notifications" });
    }
};
