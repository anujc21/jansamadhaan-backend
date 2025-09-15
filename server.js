import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import loginUser from "./api/loginUser.js";
import editProfile from "./api/editProfile.js";
import createIssue from "./api/createIssue.js";
import getUserIssues from "./api/getUserIssues.js";
import getDepartmentIssues from "./api/getDepartmentIssues.js";
import updateIssue from "./api/updateIssue.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: [
        "content-type",
        "authorization",
        "x-user-id",
        "x-ulb-id",
        "x-department-id",
    ],
};

app.use(cors(corsOptions));

app.use(express.json());

const run = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log("MongoDB connected successfully...");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.post("/login-user", (req, res) => {
    loginUser(req, res);
});

app.put("/edit-profile", (req, res) => {
    editProfile(req, res);
});

app.post("/create-issue", (req, res) => {
    createIssue(req, res);
});

app.get("/get-user-issues", (req, res) => {
    getUserIssues(req, res);
});

app.get("/get-department-issues", (req, res) => {
    getDepartmentIssues(req, res);
});

app.put("/update-issue", (req, res) => {
    updateIssue(req, res);
});

run();
