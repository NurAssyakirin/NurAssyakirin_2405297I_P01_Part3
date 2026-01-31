// import useState and useEffect to store and update state 
import { useEffect, useState } from "react";
// import useNavigate to navigate to get jobId from URL
import { useNavigate } from "react-router-dom";

function CompanyJobs() {
    // State to store list of jobs
    const [jobs, setJobs] = useState([]);
    // State to track loading status
    const [loading, setLoading] = useState(true);
    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    // function to fetch jobs from the backend API 
    const fetchJobs = async () => {
        setLoading(true); // show loading indicator
        try {
            const res = await fetch("http://localhost:5050/jobs/my-jobs", {
                headers: {
                    "x-user-id": user.id, // send user ID for authorization
                    "x-user-role": user.role, // send role (company/admin)
                },
            });
            const data = await res.json();

            // Check if the response is an array of jobs
            if (Array.isArray(data)) {
                setJobs(data);
            } else {
                setJobs([]);
            }
        } catch (err) {
            setJobs([]); // clear jobs
        } finally {
            setLoading(false); // stop loading indicator
        }
    };

    // function to delete a job by ID
    const handleDelete = async (jobId) => {
        try {
            const res = await fetch(`http://localhost:5050/jobs/${jobId}`, {
                method: "DELETE",
                headers: {
                    "x-user-id": user.id, // send user ID for authorization
                    "x-user-role": user.role, // send role (company/admin)
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete job");

            alert("Job deleted successfully");
            fetchJobs(); // refresh the list
        } catch (err) {
            alert(err.message);
        }
    };

    // fetch jobs when the component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    // show loading message while jobs are being fetched
    if (loading) return <p>Loading jobs...</p>;
    // show message if no jobs are posted
    if (jobs.length === 0) return <p>No jobs posted yet.</p>

    return (
        <div>
            <h2>My Posted Jobs</h2>

            {jobs.map(job => (
                <div key={job._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                    <h3>{job.title}</h3>
                    <p><strong>Company:</strong> {job.companyName || job.company}</p>
                    <p><strong>Salary:</strong> {job.salary}</p>
                    <p><strong>Status:</strong> {job.status}</p>

                    {/* Edit/Delete buttons for company/admin */}
                    {(user.role.toLowerCase() === "company" || user.role.toLowerCase() === "admin") && (
                        <div style={{ marginTop: "0.5rem" }}>
                            <button onClick={() => navigate(`/company/edit-job/${job._id}`)} style={{ marginRight: "0.5rem" }}>Edit</button>
                            <button onClick={() => handleDelete(job._id)}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// export the CompanyJobs component so it can be used in other parts of the app
export default CompanyJobs;
