import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    status: { type: String, default: "Applied"},
    submissionDate: { type: Date, default: Date.now }
});

// Prevents crashing during nodemon reloads
export default mongoose.models.Application || mongoose.model("Application", applicationSchema);