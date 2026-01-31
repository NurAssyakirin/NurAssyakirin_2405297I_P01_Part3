import express from "express";
import Internship from "../models/internship.js";
const router = express.Router();

/**
 * @swagger
 * /internships:
 *   get:
 *     summary: Get all internships
 *     description: Retrieve a list of all internships
 *     tags:
 *       - Internships
 *     responses:
 *       200:
 *         description: List of internships
 *       400:
 *         description: Failed to get internships
 */
// Get all internships
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find().populate("company");
    res.status(200).json(internships);
  } catch (err) {
    res.status(400).json({ error: "Failed to get all internships" });
  }
});

/**
 * @swagger
 * /internships/{id}:
 *   get:
 *     summary: Get internship by ID
 *     description: Retrieve details of a specific internship
 *     tags:
 *       - Internships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Internship ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Internship details
 *       400:
 *         description: Internship not found
 */
// Get internship by ID
router.get("/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(400).json({ error: "Internship not found" });
    res.status(200).json(internship);
  } catch (err) {
    res.status(400).json({ error: "Failed to get internship by ID" });
  }
});

/**
 * @swagger
 * /internships:
 *   post:
 *     summary: Create a new internship
 *     description: Add a new internship to the portal
 *     tags:
 *       - Internships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 default: "Internship"
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
 *               - company
 *               - description
 *     responses:
 *       201:
 *         description: Internship created successfully
 *       400:
 *         description: Failed to create internship
 */
// Create new internship: Only Company can create internships
router.post("/", async (req, res) => {
  try {
    const { title, companyName, description, category, type, salary, applicationDeadline } = req.body;

    if (!title || !companyName || !description) {
      return res.status(400).json({ error: "Title, companyName, and description are required" });
    }
    const internship = new Internship({
      title,
      company: companyName,
      description,
      category,
      type: type || "Internship",
      salary,
      applicationDeadline,
    });
    await internship.save();
    res.status(201).json(internship);
  } catch (err) {
    res.status(400).json({ error: "Failed to create internship" });
  }
});

/**
 * @swagger
 * /internships/{id}:
 *   put:
 *     summary: Update an internship by ID
 *     description: Update internship details
 *     tags:
 *       - Internships
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Internship ID
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
 *               company:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 default: "Internship"
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
 *         description: Internship updated successfully
 *       400:
 *         description: Failed to update internship
 */
// Update internship: Only Company can update internships
router.put("/:id", async (req, res) => {
  try {
    const updatedInternship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInternship) return res.status(400).json({ error: "Internship not found" });
    res.status(200).json(updatedInternship);
  } catch (err) {
    res.status(400).json({ error: "Failed to update internship" });
  }
});

/**
 * @swagger
 * /internships/{id}:
 *   delete:
 *     summary: Delete an internship by ID
 *     description: Remove an internship (Company only)
 *     tags:
 *       - Internships
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Internship ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Internship deleted successfully
 *       400:
 *         description: Internship not found / deletion failed
 *       403:
 *         description: Forbidden - only Company role allowed
 */
// Delete internship: Only Company can delete internships
router.delete("/:id", async (req, res) => {
  try {
    const deletedInternship = await Internship.findByIdAndDelete(req.params.id);
    if (!deletedInternship) return res.status(400).json({ error: "Internship not found" });
    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete internship" });
  }
});

/**
 * @swagger
 * /internships/apply:
 *   post:
 *     summary: Apply for an internship with gamification
 *     description: Students can apply for an internship. Each application awards 10 points. Students earn a "Job Hunter" badge if they reach 50 points.
 *     tags:
 *       - Internships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - internshipId
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: ID of the student applying
 *               internshipId:
 *                 type: string
 *                 description: ID of the internship
 *     responses:
 *       201:
 *         description: Internship application successful with updated points and badges
 */
// Student applies for an internship with gamification
router.post("/apply", async (req, res) => {
  try {
    const { studentId, internshipId } = req.body;
    if (!studentId || internshipId)
      return res.status(400).json({ error: "student ID and internship ID are required" });

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ error: "Internship not found" });

    const student = await Student.findById(studentId);
    if (student) {
      // Award points and badge
      student.points = (student.points || 0) + 10;
      if (student.points >= 50 && !student.badges.includes("Job Hunter")) {
        student.badges.push("Job Hunter");
      }
      await student.save();
    }

    res.status(201).json({
      message: "Internship application successful",
      points: student?.points || 0,
      badges: student?.badges || [],
    });
  } catch (err) {
    res.status(400).json({ error: "Failed to apply for internship" });
  }
});

export default router;
