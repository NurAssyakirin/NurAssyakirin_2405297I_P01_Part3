import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";

function Internships() {
  // state to store all internships
  const [internships, setInternships] = useState([]);

  // loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // search input
  const [searchTerm, setSearchTerm] = useState("");

  // type filter (optional if you have multiple internship types)
  const [internshipTypeFilter, setInternshipTypeFilter] = useState("");

  // fetch internships from backend
  useEffect(() => {
    fetch("http://localhost:5050/internships")
      .then(res => res.json())
      .then(data => {
        setInternships(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load internships:", err);
        setError("Failed to load internships");
        setLoading(false);
      });
  }, []);

  // get unique types for dropdown
  const internshipTypes = [...new Set(internships.map(job => job.type).filter(Boolean))];

  // filter internships by search and type
  const filteredInternships = internships.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (internshipTypeFilter === "" || job.type === internshipTypeFilter)
    );
  });

  if (loading) return <p>Loading internships...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>All Internships</h2>

      {/* Search input */}
      <input
        className="form-control"
        type="text"
        placeholder="Search internships..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ maxWidth: "300px", marginBottom: "1rem" }}
      />

      {/* Display filtered internships */}
      {filteredInternships.length === 0 ? (
        <p>No internships match your criteria.</p>
      ) : (
        filteredInternships.map(job => (
          <JobCard key={job._id} job={job} />
        ))
      )}
    </div>
  );
}

export default Internships;