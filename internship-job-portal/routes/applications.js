import express from "express";
import Application from "../models/application.js";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new application
 *     description: Add a new application for a student to a job
 *     tags:
 *       - Applications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: The ID of the student applying
 *               jobId:
 *                 type: string
 *                 description: The ID of the job being applied to
 *               status:
 *                 type: string
 *                 default: "Applied"
 *               submissionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Defaults to current date/time
 *             required:
 *               - studentId
 *               - jobId
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Failed to create application
 */
// Only Student can apply for jobs
router.post("/", async (req, res) => {
    try {
        const { studentId, jobId } = req.body;

        if (!studentId || !jobId) {
            return res.status(400).json({ error: "student ID and job ID are required" });
        }

        // Create the Application
        const application = new Application({ studentId, jobId });
        await application.save();

        // Gamification: Award points to the student
        const student = await Student.findById(studentId);
        if (student) {
            await student.addPoints(10, "Job Hunter"); // Award 10 points for applying
        }

        // Respond with application details and updated gamification info
        res.status(201).json({
            application,
            points: student?.points || 0,
            badges: student?.badges || [],
        });
    } catch (err) {
        res.status(400).json({ error: "Failed to create application" });
    }
});

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Retrieve all applications
 *     description: Returns a list of all job applications with student info including points and badges
 *     tags:
 *       - Applications
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get("/", async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("studentId", "name email points badges")
            .populate("jobId", "title");

        res.status(200).json(applications);
    } catch (err) {
        res.status(400).json({ error: "Failed to get all applications" });
    }
});

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Retrieve a specific application
 *     description: Get a single application by its ID including student info, points, and badges
 *     tags:
 *       - Applications
 */
// Get application by ID: Only Company or Student can view application by ID
router.get("/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate("studentId", "name email points badges").populate("jobId", "title");
        if (!application) return res.status(404).json({ message: "Application not found" });
        res.status(200).json(application);
    } catch (err) {
        res.status(400).json({ error: "Failed to get application by ID" });
    }
});

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update an application by ID
 *     description: Update the status or submission date of an application
 *     tags:
 *       - Applications
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Application ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Status of the application (e.g., "Applied", "Reviewed", "Accepted")
 *               submissionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date of submission
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       400:
 *         description: Failed to update application
 */
// Update application: Only Student can update their application
router.put("/:id", async (req, res) => {
    try {
        const updatedApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedApplication) return res.status(400).json({ message: "Application not found" });
        res.status(200).json(updatedApplication);
    } catch (err) {
        res.status(400).json({ error: "Failed to update application" });
    }
});

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     description: Students can delete their own applications
 *     tags:
 *       - Applications
 */
// Delete application: Only Student can delete their application
router.delete("/:id", async (req, res) => {
    try {
        const deletedApplication = await Application.findByIdAndDelete(req.params.id);
        if (!deletedApplication) return res.status(400).json({ message: "Application not found" });
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete application" });
    }
});

/**
 * @swagger
 * /applications/student:
 *   get:
 *     summary: Get all applications for a student
 *     description: Returns all job/internship applications of a student with job details
 *     tags:
 *       - Applications
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request - studentId missing or invalid
 */
router.get("/student", async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ error: "studentId is required" });
        }

        // Find applications for this student and populate the job details
        const applications = await Application.find({ studentId })
            .populate("jobId", "title companyName description type category salary status");

        res.status(200).json({ applications });

    } catch (err) {
        console.error("Student dashboard error:", err);
        res.status(400).json({ error: "Failed to get dashboard" });
    }
});

export default router;