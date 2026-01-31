// use to store and update form data
import { useState } from "react";

// use to get URL parameters and navigation links
import { useParams, Link } from "react-router-dom";

function Apply({ jobs, addApplication }) {

    // Get Job ID from URL
    const { id } = useParams();

    // Find selected job by ID
    const job = jobs.find(j => j.id === parseInt(id));

    // Form State to store user input
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // If job not found, display error message
    if (!job) {
        return <p>Job not found.</p>
    }

    // Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload

        // Save Application data
        addApplication(job.id, name);
        alert(`Application for "${job.title}" submitted successfully!`);

        // Reset Form
        setName("");
        setEmail("");
    };

    return (
        <div className="card">
            <h2>Apply for {job.title}</h2>
            <p><strong>Company:</strong> {job.company}</p>

            {/* Application Form */}
            <form onSubmit={handleSubmit}>

                {/* Name Input */}
                <input
                    className="form-control"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                {/* Email Input */}
                <input
                    className="form-control"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">Submit Application</button>
            </form>
            <br />
            {/* Navigate back to jobs page */}
            <Link to="/jobs" className="view-details-link">Back to Jobs</Link>
        </div>
    );
}

// export the Apply component so it can be used in other parts of the app
export default Apply;
