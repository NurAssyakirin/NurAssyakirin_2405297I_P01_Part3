import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    role: { type: String, enum: ["Company", "Admin"], default: "Company" },
    industry: { type: String },
});

// Prevents crashing during nodemon reloads
export default mongoose.models.Company || mongoose.model("Company", companySchema);