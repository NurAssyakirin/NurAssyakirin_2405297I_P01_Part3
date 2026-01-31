// import useEffect and useState for managing state and side effects
import { application } from "express";
import { useEffect, useState } from "react";
// import useParams to get jobId from the URL
import { useParams } from "react-router-dom";

function JobApplications() {
    // get the jobId from the URL
    const { jobId } = useParams();
    // state to store applications for this job
    const [applications, setApplications] = useState([]);

    // fetch applications when the component mounts or when jobId changes
    useEffect(() => {
        // send GET request to backend to get all company applications
        fetch(`/applications/company`)
            .then(res => res.json())
            .then(data => {
                // Filter applications that belong to the current jobId
                const jobApps = data.applications.filter(app => app.jobId._id === jobId);
                // update state with filtered applications
                setApplications(jobApps);
            });
    }, [jobId]); // dependency array ensures this run when jobId changes

    return (
        <div>
            <h2>Applications for Job</h2>
            {/* Map over applications array and display each applicant's info */}
            {applications.map(app => (
                <div key={app._id}>
                    <p>Name: {app.studentId.name}</p>
                    <p>Email: {app.studentId.email}</p>
                </div>
            ))}
{/* 
            Show message if no applications exists */}
            {applications.length === 0 && <p>No applications yet for this job.</p>}
        </div>
    );
}

// export the JobApplications component so it can be used in other parts of the app
export default JobApplications;
