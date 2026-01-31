// use to store and update form data
import { useState } from "react";

// import JobCard data component
import JobCard from "../components/JobCard";

function Jobs({ jobs = [] }) {
  // state to store search term
  const [searchTerm, setSearchTerm] = useState("");

  // state to store job type filter
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  // Exclude internships
  const nonInternshipJobs = jobs.filter(
    job => job.type !== "Internship"
  );

  // get unique job types for filter dropdown
  const jobTypes = [
    ...new Set(nonInternshipJobs.map(job => job.type).filter(Boolean))
  ];

  // filter jobs based on search term and job type
  const filteredJobs = nonInternshipJobs.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (jobTypeFilter === "" || job.type === jobTypeFilter)
    );
  });

  return (
    <div>
      <h2>All Jobs</h2>

      {/* Search input */}
      <input
        className="form-control"
        type="text"
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ maxWidth: "300px", marginBottom: "1rem" }}
      />

      {/* Display filtered jobs */}
      {filteredJobs.length === 0 ? (
        <p>No jobs match your criteria.</p>
      ) : (
        filteredJobs.map(job => (
          <JobCard key={job._id} job={job} />
        ))
      )}
    </div>
  );
}

// export the Jobs component so it can be used in other parts of the app
export default Jobs;
