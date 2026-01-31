// use to get URL parameters and navigation links
import { useParams, Link } from "react-router-dom";

// import NotFound component for invalid job IDs
import NotFound from "./NotFound";

function JobDetails({ jobs = [] }) {
    // Get Job ID from URL (etc. /jobs/123 -> id = 123)
    const { id } = useParams();

    // wait for jobs to load else show a loading message
    if (!jobs || jobs.length === 0) {
        return <p>Loading job details..</p>;
    }

    // // Find selected job by ID
    const job = jobs.find(j => j._id === id);

    // If job not found, show NotFound page
    if (!job) {
        return <NotFound />;
    }

    return (
        <div className="card">
            {/* Display Job Title */}
            <h2>{job.title}</h2>
            <br />
            {/* Display Salary */}
            {job.salary && (
                <p><strong>Salary:</strong> {job.salary}</p>
            )}
            {/* Display Company */}
            <p><strong>Company:</strong> {job.company}</p>
            {/* Display Job Description */}
            <p>Description: {job.description}</p>
            <div className="job-details">
                <Link to="/jobs" className="view-jobs-link">Back to Jobs</Link>
                <Link to={`/apply/${job._id}`} className="view-details-link">Apply Now</Link>
            </div>
        </div>
    );
}

// export the JobDetails component so it can be used in other parts of the app
export default JobDetails;
