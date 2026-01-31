import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';

function Jobs() {
  const [jobs, setJobs] = useState([]); // State to hold job listings
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(""); // State to manage error status

  useEffect(() => {
    // Fetch job listings from the backend API
    fetch('http://localhost:5000/jobs').then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      return response.json();
    })
      .then((data) => {
        setJobs(data); // Update jobs state with fetched data
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        setError(error.message); // Set error message if fetch fails
        setLoading(false); // Set loading to false in case of error
      });
  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) return <p>Loading Jobs..</p>; // Show loading message while fetching data
  if (error) return <p>{error}</p>; // Show error message if fetch fails
  if (jobs.length === 0) return <p>No jobs available.</p>; // Show message if no jobs are found

  return (
    <div>{jobs.map((job) => (
      <JobCard key={job._id} job={job} />
    ))}
    </div>
  );
}

export default Jobs;