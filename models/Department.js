import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    id: String,
    name: String,
    password: String,
});

export default mongoose.model("Department", DepartmentSchema);
