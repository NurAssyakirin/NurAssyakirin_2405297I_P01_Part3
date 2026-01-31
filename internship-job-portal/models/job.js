import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyName: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ["Full-Time", "Internship"], required: true },
    salary: { type: String, required: true },
    applicationDeadline: { type: Date },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" }
},
    { timestamps: true }
);

// Prevents crashing during nodemon reloads
export default mongoose.models.Job || mongoose.model("Job", jobSchema);