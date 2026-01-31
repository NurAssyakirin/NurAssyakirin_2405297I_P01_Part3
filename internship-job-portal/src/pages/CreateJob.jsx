// import useState to store and update state for selected category
import { useState } from "react";
// import useNavigate to navigate to get jobId from URL
import { useNavigate } from "react-router-dom";

function CreateJob() {
    const navigate = useNavigate();
    // get log in user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // state to store form fields for creating a job/internship
    const [form, setForm] = useState({
        title: "", // job title
        companyName: "", // company name
        description: "", // job description
        category: "", // job category
        type: "Internship", // default type 
        salary: "", // job salary
    });

    // function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload

        // add user ID to job data to associate the job with the company
        const jobData = {
            ...form,
            companyId: user.id, // important for backend
        };

        try {
            // send POST request to backend to create the job
            const res = await fetch("http://localhost:5050/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // tell backend we are sending JSON
                    "x-user-id": user.id, // send user ID in headers for authentication
                    "x-user-role": user.role, // send user role in headers
                },
                body: JSON.stringify(jobData), // send form data
            });

            // parse response as JSON
            const data = await res.json();
            console.log("Server response:", data);

            // if request failed throw an error
            if (!res.ok) {
                // only throw error if request failed
                throw new Error(data.error || "Failed to create job");
            }

            // redirect to the company's job listing page on sucess
            navigate("/company/jobs");
        } catch (err) {
            // show error message if request fails
            alert(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Job / Internship</h2>

            {/* Job Title */}
            <input
                placeholder="Job Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
            />

            {/* Company Name */}
            <input
                placeholder="Company Name"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
            />

            {/* Category */}
            <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            {/* Salary */}
            <input
                placeholder="Salary"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                required
            />

            {/* Description */}
            <textarea
                placeholder="Job Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
            />

            {/* Type */}
            <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
            >
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time</option>
            </select>

            <button type="submit">Create</button>
        </form>
    );
}

// export the CreateJob component so it can be used in other parts of the app
export default CreateJob;