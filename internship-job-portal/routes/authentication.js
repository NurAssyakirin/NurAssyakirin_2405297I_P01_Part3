import express from "express";
import Student from "../models/student.js";
import Company from "../models/company.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new Student or Company
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               type:
 *                 type: string
 *                 enum: [Student, Company]
 *                 example: Student
 *             required:
 *               - name
 *               - email
 *               - password
 *               - type
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or registration failed
 */
// Register
router.post("/register", async (req, res) => {
    const { name, email, password, type } = req.body; // type can be 'Student' or 'Company'
    try {
        if (!name || !email || !password || !type) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (type === "Student") {
            const newUser = new Student({ name, email, password });
            await newUser.save();
            res.status(201).json({
                message: "Student registered successfully",
                user: { id: newUser._id, name: newUser.name, role: "Student" }
            });

        } else if (type === "Company") {
            const newUser = new Company({ name, email, password });
            await newUser.save();
            res.status(201).json({
                message: "Company registered successfully",
                user: { id: newUser._id, name: newUser.name, role: "Company" }
            });
        } else {
            res.status(400).json({ error: "Invalid user type" });
        }
    } catch (err) {
        res.status(400).json({ error: "Registration failed" });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a Student or Company
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               type:
 *                 type: string
 *                 enum: [Student, Company]
 *                 example: Student
 *             required:
 *               - email
 *               - password
 *               - type
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or input
 *       500:
 *         description: Server error
 */
// Login
router.post("/login", async (req, res) => {
    try {
        let { email, password, type } = req.body; // type can be 'Student' or 'Company'

        // Validate required fields
        if (!email || !password || !type) {
            return res.status(400).json({ error: "Email, password, and type are required" });
        }

        // Normalized type: trim spaces and convert to lowercase
        type = type?.trim().toLowerCase();

        let user;
        let role;

        if (type === "student") {
            user = await Student.findOne({ email });
            role = "Student";
        } else if (type === "company") {
            user = await Company.findOne({ email });
            role = "Company";
        } else {
            return res.status(400).json({ error: "Invalid user type" });
        }

        if (!user || user.password !== password) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Return user information including role
        res.status(200).json({
            message: "Login Successful",
            user: { id: user._id, name: user.name, role },
        });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
