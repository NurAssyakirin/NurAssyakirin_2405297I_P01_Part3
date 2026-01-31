// use for navigation between different pages
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// use to store and update form data
import { useState, useEffect } from 'react';

// import components and pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Apply from './pages/Apply';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateJob from './pages/CreateJob';
import CompanyJobs from "./pages/CompanyJobs";
import EditJob from "./pages/EditJob";
import Internships from './pages/Internships';

// import app styles
import "./App.css";

function App() {
  // store logged-in user role (student / company)
  // load from localStorage after refresh
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'student');

  // store all jobs from backend
  const [jobs, setJobs] = useState([]);

  // store all internships from backend
  const [internships, setInternships] = useState([]);

  // loading and error states for job fetch
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch jobs and internships from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await fetch("http://localhost:5050/jobs");
        const internshipsRes = await fetch("http://localhost:5050/internships");

        const jobsData = await jobsRes.json();
        const internshipsData = await internshipsRes.json();

        // Add id for frontend convenience
        setJobs(jobsData.map(job => ({ ...job, id: job._id })));
        setInternships(internshipsData.map(intern => ({ ...intern, id: intern._id })));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs or internships");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // state to store job applications (saved in localStorage)
  const [applications, setApplications] = useState(() => {
    const savedApps = localStorage.getItem('applications');
    return savedApps ? JSON.parse(savedApps) : [];
  });

  // add a new job application
  const addApplication = (jobId, studentName) => {
    const newApp = { id: applications.length + 1, jobId, studentName };
    // Create a new array by copying all exisiting applications and adding the new one
    const updatedApps = [...applications, newApp];
    setApplications(updatedApps);
    localStorage.setItem('applications', JSON.stringify(updatedApps));
  };

  return (
    // Set up routing for the application
    <BrowserRouter>
      {/* Navbar component with user role passed */}
      <Navbar role={role} />
      <Routes>
        <Route path='/' element={loading ? <p>Loading jobs..</p> : error ? <p>Error: {error}</p> : <Home jobs={jobs} />} />

        {/* Jobs Page */}
        <Route path='/jobs' element={<Jobs jobs={jobs} />} />
        <Route path='/jobs/:id' element={<JobDetails jobs={jobs} />} />

        {/* Internship Page */}
        <Route path='/internships' element={<Internships jobs={jobs} />} />

        <Route path='/apply/:id' element={<Apply jobs={jobs} addApplication={addApplication} />} />
        <Route path='/profile' element={<Profile />} />

        {/* Authentication */}
        <Route path='/login' element={<Login setRole={setRole} />} />
        <Route path='/register' element={<Register />} />

        {/* Company Pages */}
        <Route path='/company/create-job' element={<CreateJob />} />
        <Route path='/company/jobs' element={<CompanyJobs />} />
        <Route path='/company/edit-job/:id' element={<EditJob />} />

        {/* 404 Not Found Page */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// export the App component so it can be used in main.jsx
export default App;
