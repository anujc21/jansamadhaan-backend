const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
    id: String,
    name: String,
    password: String,
});

module.exports = mongoose.model("Department", DepartmentSchema);
