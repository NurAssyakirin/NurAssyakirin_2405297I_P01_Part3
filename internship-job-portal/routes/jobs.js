import express from "express";
import Job from "../models/job.js";
const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     description: Add a new job to the portal
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               companyName:
 *                 type: string
 *               companyId:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: ["Full-Time", "Internship"]
 *               salary:
 *                 type: string
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: ["Open", "Closed"]
 *                 default: "Open"
 *             required:
 *               - title
 *               - description
 *               - companyName
 *               - category
 *               - type
 *               - salary
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Failed to create job
 */
// Create new job: only Company can create jobs
router.post("/", async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: "Failed to create job" });
    }
});


/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Returns a list of all jobs with populated company details
 *     tags:
 *       - Jobs
 *     responses:
 *       200:
 *         description: A list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   location:
 *                     type: string
 *                   companyId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       industry:
 *                         type: string
 */
// Get all jobs for Company/Admin
router.get("/my-jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        console.error("My jobs error:", err);
        return res.status(400).json({ error: "Failed to get all jobs" });
    }
});

// Get all jobs for students
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find().populate("companyId", "name");
        res.status(200).json(jobs);
    } catch (err) {
        console.error("Get all jobs error:", err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
// Get job by ID
router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        } res.status(200).json(job);
    } catch (err) {
        res.status(400).json({ error: "Invalid Job ID" });
    }
});

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update a job by ID
 *     description: Update job details
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Job ID
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               companyName:
 *                 type: string
 *               companyId:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: ["Full-Time", "Internship"]
 *               salary:
 *                 type: string
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: ["Open", "Closed"]
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       400:
 *         description: Failed to update job
 */
// Update job: only Company can update jobs 
router.put("/:id", async (req, res) => {
    try {
        // find the job first
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if the logged-in company is the owner
        if (req.user.role === "Company" && job.companyId.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized to edit this job" });
        }

        // Update allowed fields
        const fieldsToUpdate = ["title", "description", "category", "type", "salary", "status"];
        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) job[field] = req.body[field];
        });

        await job.save();
        res.status(200).json(job);

    } catch (err) {
        res.status(400).json({ error: "Failed to update job" });
    }
});

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     description: Remove a job by its ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       400:
 *         description: Invalid ID or delete failed
 */
// Delete job: only Company can delete jobs
router.delete("/:id", async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(400).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Invalid Job ID" });
    }
});

export default router;