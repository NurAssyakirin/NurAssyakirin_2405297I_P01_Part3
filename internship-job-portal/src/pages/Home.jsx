// import useEffect to store and update state 
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home({ jobs = [] }) {
  const categories = ["Finance", "Education", "IT", "Transportation", "Science"];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [internships, setInternships] = useState([]);

  const [loadingInternships, setLoadingInternships] = useState(true);

  // Fetch internships from backend
  useEffect(() => {
    fetch("http://localhost:5050/internships") // this should point to your internships collection
      .then(res => res.json())
      .then(data => {
        setInternships(data);
        setLoadingInternships(false);
      })
      .catch(err => {
        console.error("Failed to load internships:", err);
        setLoadingInternships(false);
      });
  }, []);

  // Filter jobs and internships by selected category
  const filteredJobs = selectedCategory
    ? jobs.filter(job => job.category?.toLowerCase() === selectedCategory.toLowerCase())
    : jobs;

  const filteredInternships = selectedCategory
    ? internships.filter(intern => intern.category?.toLowerCase() === selectedCategory.toLowerCase())
    : internships;

  return (
    <div>
      <p>Find your dream job or internship today!</p>

      {/* Category Filters */}
      <div className="category-filters">
        <button
          onClick={() => setSelectedCategory(null)}
          style={{ fontWeight: selectedCategory === null ? "bold" : "normal" }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{ fontWeight: selectedCategory?.toLowerCase() === cat.toLowerCase() ? "bold" : "normal" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Jobs */}
      {filteredJobs.length === 0 ? (
        <p>No jobs found{selectedCategory ? ` for ${selectedCategory}` : ""}.</p>
      ) : (
        filteredJobs.map(job => (
          <div key={job._id} className="card">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company || job.companyName || job.companyId?.name || "N/A"}</p>
            <p><strong>Category:</strong> {job.category || "Uncategorized"}</p>
            <p><strong>Type:</strong> {job.type || "N/A"}</p>
            <p><strong>Salary:</strong> {job.salary || "N/A"}</p>
            <Link to={`/jobs/${job._id}`} className="view-details-link">View Details</Link>
          </div>
        ))
      )}

      {/* Internships */}
      {filteredInternships.length === 0 ? (
        <p>No internships found{selectedCategory ? ` for ${selectedCategory}` : ""}.</p>
      ) : (
        filteredInternships.map(intern => (
          <div key={intern._id} className="card">
            <h3>{intern.title}</h3>
            <p><strong>Company:</strong> {intern.company || "N/A"}</p>
            <p><strong>Category:</strong> {intern.category || "Uncategorized"}</p>
            <p><strong>Type:</strong> {intern.type || "N/A"}</p>
            <p><strong>Salary:</strong> {intern.salary || "N/A"}</p>
            <Link to={`/internships/${intern._id}`} className="view-details-link">View Details</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
