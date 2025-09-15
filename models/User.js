import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    phone: String,
    countryCode: String,
    newUser: Boolean,
});

export default mongoose.model("User", UserSchema);
