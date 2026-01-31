import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    role: { type: String, enum: ["Student", "Admin"], default: "Student" },
    points: { type: Number, default: 0 }, // Additional Feature: Gamification (points system)
    badges: { type: [String], default: [] }, // Additional Feature: Gamification (badges system)
});

// method to add points and optionally award a badge
studentSchema.methods.addPoints = async function(points, badgeName, badgeThreshold = 50) {
    this.points = (this.points || 0) + points;

    if (badgeName && this.points >= badgeThreshold && !this.badges.includes(badgeName)) {
        this.badges.push(badgeName);
    }
    await this.save();
    return this;
}

// Prevents crashing during nodemon reloads
export default mongoose.models.Student || mongoose.model("Student", studentSchema);