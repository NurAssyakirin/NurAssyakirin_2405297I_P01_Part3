// use to get URL parameters and navigation links
import { Link, useNavigate } from "react-router-dom";

const formatSalary = (salary) => {
    if (!salary || salary.trim() === "") return "N/A";

    // salary contains letters (SGD, month, etc),
    if (!/^\d+(\.\d+)?$/.test(salary)) return salary;

    const num = Number(salary);
    if (isNaN(num)) return "N/A";

    // Format
    return `SGD $${Number(salary).toLocaleString()}/month`;
};


// JobCard component to display individual job information
function JobCard({ job, user, onDelete }) {
    const navigate = useNavigate();

    return (
        <div className="card job-card" style={{ marginBottom: "1rem" }}>
            {/* Show salary badge if available */}
            {job.salary && (
                <span className="salary-badge">{formatSalary(job.salary)}</span>
                // <p><strong>Salary:</strong> {formatSalary(job.salary)}</p>
            )}
            <h4>{job.title}</h4>
            <p>
                <strong>Company:</strong>{" "}
                {job.company || job.companyName || job.companyId?.name || "N/A"}
            </p>
            <p>{job.description}</p>
            <p><strong>Category:</strong> {job.category}</p>
            <p><strong>Type:</strong> {job.type}</p>

            {/* Use MongoDB _id for routing */}
            <Link to={`/jobs/${job._id}`} className="view-details-link">View Details</Link>

            {/* Only show Edit/Delete for Company/Admin */}
            {user && (user.role === "company" || user.role === "admin") && (
                <div style={{ marginTop: "0.5rem" }}>
                    <button onClick={() => navigate(`/company/edit-job/${job._id}`)}>Edit</button>
                    <button onClick={() => onDelete(job._id)} style={{ marginLeft: "0.5rem" }}>Delete</button>
                </div>
            )}
        </div>
    );
}

// export the JobCard component so it can be used in other parts of the app
export default JobCard;
