# Internship Job Portal Web Application

This is a full stack Internship Job Portal Web Application built as part of the final assessment.
This application allows companies to post, edit and delete job and internship listings while students can browse and view available jobs and internships either based on the job type (etc. IT, Education) or from the homepage which list all jobs and internships.

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB with Mongoose, MongoDB Compass
- API Documentation: Swagger UI

## Core Features

### Student
- View all Jobs and Internship Listings
- Filter Jobs by category and type
- View all Jobs and Internships Details 

### Company
- Create Jobs and Internships Listings
- Edit existing Jobs and Internships Details
- Delete Jobs and Internships Listing
- View Jobs and Internships by the Company

## Additional Feature: Role-Based Access Control

This application implements a role-based access control to show the difference between Company and Student users.

- Company users can:
    - Create Jobs and Internships
    - Edit its own Jobs and Internships
    - Delete its own Jobs and Internships
    - View its own Jobs and Internships

- Student users can:
    - View Jobs and Internships Listings
    - Cannot Create, Edit or Delete Jobs and Internships

This feature is enforced:
- On the backend is using authentication and check role middleware if its student or company
- On the frontend is by conditionally rendering UI elements based on roles (student or company)

## API Documentation

Swagger UI is implemented to test and document all back-end APIs.

Access Swagger UI:
http://localhost:5050/api-docs

## How to run the project

### Backend
npm install
npm run dev

### Frontend
npm install
npm run client 
