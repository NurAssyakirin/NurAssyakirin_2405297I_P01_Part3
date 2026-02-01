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
[http://localhost:5050/api-docs]

## Additional Feature: Deployment & GitOps
This project is deployed online using Git-based workflows (GitOps) to ensure continous integration and deployment.

- Deployment: The application is hosted on a cloud platform (etc. Render or AWS) so that users can access it online.

- GitOps Workflow: Changes to the respository are automatically tracked and deployed through a Git workflow:
    - code is pushed to the main branch.
    - automated deployment pipeline picks up changes and updates the hosted application.
    - this is to ensure that the live version is always in sync with the respository.

- Benefits:
    - students and companies can access the app without having to run it locally.
    - simplifies updates and bug fixes.
    - demonstrate DevOps practices for full-stack applications.

Live Application URL:
[https://studentmanagementsystem-nurassyakirin.onrender.com/](https://studentmanagementsystem-nurassyakirin.onrender.com/)

GitHub URL:
[https://github.com/NurAssyakirin/NurAssyakirin_2405297I_P01_Part3.git]

## How to run the project

### Backend
npm install
npm run dev

### Frontend
npm install
npm run client 
