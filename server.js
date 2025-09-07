const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const createIssue = require("./api/createIssue");
const getUserIssues = require("./api/getUserIssues");
const getDepartmentIssues = require("./api/getDepartmentIssues");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"],
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

app.post("/create-issue", (req, res) => {
    createIssue(req, res);
});

app.get("/get-user-issues", (req, res) => {
    getUserIssues(req, res);
});

app.get("/get-department-issues", (req, res) => {
    console.log(1);

    getDepartmentIssues(req, res);
});

run();
