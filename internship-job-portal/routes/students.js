import mongoose from "mongoose";
import express from "express";
import Student from "../models/student.js";

const router = express.Router();

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     description: Add a new student to the portal
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["Student", "Admin"]
 *                 default: "Student"
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Failed to create student
 */
// Create new student
router.post("/", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: "Failed to create student" });
    }
});

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve all students (Company only)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *       400:
 *         description: Failed to get students
 *       403:
 *         description: Forbidden - only Company role allowed
 */
// Get all students: Only Company can view all students list
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(400).json({ error: "Failed to get all students" });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     description: Retrieve a single student's details (Company only)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Student ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details
 *       400:
 *         description: Failed to get student
 *       403:
 *         description: Forbidden - only Company role allowed
 *       404:
 *         description: Student not found
 */
// Get student by ID: Only Company can view student details
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.status(200).json(student);
    } catch (err) {
        res.status(400).json({ error: "Failed to get student by ID" });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     description: Update student details
 *     tags:
 *       - Students
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Student ID
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["Student", "Admin"]
 *               points:
 *                 type: number
 *               badges:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Failed to update student
 */
// Update student: Only Students can update their own profile
router.put("/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedStudent) {
            return res.status(400).json(updatedStudent);
        }
        res.status(200).json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: "Failed to update student by ID" });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Delete a student profile (Admin only)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Student ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       400:
 *         description: Failed to delete student
 *       403:
 *         description: Forbidden - only Admin role allowed
 */
// Delete student: Only Admin can delete student profiles
router.delete("/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(400).json({ error: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete student by ID" });
    }
});

export default router;