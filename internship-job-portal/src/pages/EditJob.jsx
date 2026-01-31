// import useState and useEffect to store and update state 
import { useState, useEffect } from "react";
// import useNavigate to navigate and useParams to get jobId from URL
import { useNavigate, useParams } from "react-router-dom";

function EditJob() {
    const { id } = useParams(); // get job ID from URL
    const navigate = useNavigate();
    // get the logged in user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // form state to store job details
    const [form, setForm] = useState({
        title: "",
        companyName: "",
        description: "",
        category: "",
        type: "Internship", // default type
        salary: "",
        status: "Open", // default status
    });

    // loading state to show loading message while fetching job data
    const [loading, setLoading] = useState(true);

    // Fetch job details to populate the form
    useEffect(() => {
        const fetchJob = async () => {
            try {
                // send GET request to backend to fetch job details
                const res = await fetch(`http://localhost:5050/jobs/${id}`, {
                    headers: {
                        "x-user-id": user.id, // send user ID for authorization
                        "x-user-role": user.role, // send role (company/admin)
                    },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch job");

                // populate form with job details
                setForm({
                    title: data.title,
                    companyName: data.companyName || data.company,
                    description: data.description,
                    category: data.category || "",
                    type: data.type,
                    salary: data.salary,
                    status: data.status || "Open",
                });
            } catch (err) {
                // show error and redirect back to company jobs page
                alert(err.message);
                navigate("/company/jobs");
            } finally {
                setLoading(false); // stop loading
            }
        };

        fetchJob();
    }, [id]);

    // function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload

        try {
            // send PUT request to update job
            const res = await fetch(`http://localhost:5050/jobs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", // tell backend we are sending JSON
                    "x-user-id": user.id, // send user ID in headers for authentication
                    "x-user-role": user.role, // send user role in headers
                },
                body: JSON.stringify(form), // send form data
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update job");

            alert("Job updated successfully");
            navigate("/company/jobs");
        } catch (err) {
            alert(err.message);
        }
    };

    // show loading message while job details are being fetched
    if (loading) return <p>Loading job details...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Job / Internship</h2>

            <input
                placeholder="Job Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
            />

            <input
                placeholder="Company Name"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
            />

            <input
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <input
                placeholder="Salary"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                required
            />

            <textarea
                placeholder="Job Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
            />

            <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
            >
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time</option>
            </select>

            <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
            </select>

            <button type="submit">Update Job</button>
        </form>
    );
}
// export the EditJob component so it can be used in other parts of the app
export default EditJob;
