import express from "express";
import Company from "../models/company.js";

const router = express.Router();

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     description: Add a new company to the portal (Company role only)
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
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
 *                 enum: ["Company", "Admin"]
 *               industry:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Failed to create company
 *       403:
 *         description: Forbidden - only Company role allowed
 */
// Create new company: Only Company can create companies
router.post("/", async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (err) {
        res.status(400).json({ error: "Failed to create company" });
    }
});

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     description: Retrieve a list of all companies
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: List of companies
 *       400:
 *         description: Failed to get companies
 */
// Get all companies
router.get("/", async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (err) {
        res.status(400).json({ error: "Failed to get all companies" });
    }
});

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     description: Retrieve details of a specific company
 *     tags:
 *       - Companies
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Company ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details
 *       400:
 *         description: Company not found
 */
// Get company by ID
router.get("/:id", async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(400).json({ error: "Company not found" });
        }
        res.status(200).json(company);
    } catch (err) {
        res.status(400).json({ error: "Failed to get company by ID" });
    }
});

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update a company by ID
 *     description: Update company details (Company role only)
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Company ID
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
 *                 enum: ["Company", "Admin"]
 *               industry:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Failed to update company
 *       403:
 *         description: Forbidden - only Company role allowed
 */
// Update company: Only Company can update companies
router.put("/:id", async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // ensure schema validation
        );
        if (!updatedCompany) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.status(200).json(updatedCompany);
    } catch (err) {
        console.error("Update company error:", err);
        res.status(400).json({ error: "Failed to update company" });
    }
});

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company by ID
 *     description: Remove a company from the portal (Company role only)
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Company ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       400:
 *         description: Failed to delete company
 *       403:
 *         description: Forbidden - only Company role allowed
 */
// Delete company: Only Company can delete companies
router.delete("/:id", async (req, res) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id);
        if (!deletedCompany) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.status(200).json({ message: "Company deleted successfully" });
    } catch (err) {
        console.error("Delete company error:", err);
        res.status(400).json({ error: "Failed to delete company" });
    }
});

export default router;