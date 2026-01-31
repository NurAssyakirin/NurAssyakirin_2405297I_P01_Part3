import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import Swagger UI libraries
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config(); // Load environment variables from .env

// Import Routes
import studentsRouter from "./routes/students.js";
import companiesRouter from "./routes/companies.js";
import internshipsRouter from "./routes/internships.js";
import jobsRouter from "./routes/jobs.js";
import applicationsRouter from "./routes/applications.js";
import authenticationRoutes from "./routes/authentication.js"; // defines login

const app = express();
// Enables CORS so your front-end can access your backend API without browser blocking it.
app.use(cors());
// Allows Express to parse JSON data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authenticationRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err));

// Use Routes
app.use("/students", studentsRouter);
app.use("/companies", companiesRouter);
app.use("/internships", internshipsRouter);
app.use("/jobs", jobsRouter);
app.use("/applications", applicationsRouter);

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Internship & Job Portal API",
            version: "1.0.0",
            description: "API documentation for Internship & Job Portal",
        },
        components: {
            schemas: {
                Application: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "61234abcd5678ef901234567" },
                        studentId: { type: "string", example: "61234abcd5678ef901234567" },
                        jobId: { type: "string", example: "61234abcd5678ef901234567" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    },
    apis: ["./routes/*.js"], // Path to your API route files
};

// Generate Swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Use app.use() to mount the Swagger UI to /api-docs:
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Initial route to test if your backend server is running properly
app.get("/", async (req, res) => {
    res.send("<h1>Internship & Job Portal API Running</h1>");
});

// Set port
const PORT = process.env.PORT || 5050;
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});