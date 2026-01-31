import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    type: { type: String, default: "Internship" },
    salary: { type: String },
    applicationDeadline: { type: Date },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
});

// Prevents crashing during nodemon reloads
export default mongoose.models.Internship || mongoose.model("Internship", internshipSchema);