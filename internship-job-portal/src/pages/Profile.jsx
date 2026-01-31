// import react to create components
import React from "react";

function Profile() {
    const user = {
        fullName: "Nur Assyakirin",
        email: "2405297I@student.tp.edu.sg",
        contactNumber: "89493307",
        aboutMe: "I am a dedicated and passionate student at Temasek Polytechnic, pursuing a Diploma in Information Technology.",
        workExperiences: [
            { period: "Mar 24 - Sep 24", role: "IT Support Technician", company: "Hsin Yi Pte Ltd" },
            { period: "Sep 22 - Sep 22", role: "IT Intern", company: "Rayton Solutions Pte Ltd" },
            { period: "Nov 17 - Dec 18", role: "Promoter", company: "Triumph Pte Ltd" },
        ],
        education: [
            { period: "Apr 24 - Current", degree: "Diploma in IT", institution: "Temasek Polytechnic" },
            { period: "Jan 23 - Dec 24", degree: "Higher Nitec in IT Application Dev", institution: "ITE East" },
            { period: "Jan 21 - Dec 22", degree: "Nitec in Web Applications", institution: "ITE East" },
        ],
    };

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>

            <br />

            <div className="profile-header">
                <div className="profile-image">
                    {/* Placeholder image */}
                    <img src="" alt="Profile" />
                </div>

                {/* User Information */}
                <div className="profile-info">
                    <p><strong>Full Name:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Contact Number:</strong> {user.contactNumber}</p>
                </div>
            </div>

            {/* About Me */}
            <section className="about-me-section">
                <h2>About Me</h2>
                <p>{user.aboutMe}</p>
            </section>

            {/* Work Experiences */}
            <section className="profile-columns">
                <div style={{ flex: 1 }}>
                    <h3>Work Experiences</h3>
                    {user.workExperiences.map((work, index) => (
                        <p key={index}>
                            <strong>{work.period}</strong><br />
                            {work.role} at {work.company}
                        </p>
                    ))}
                </div>

                {/* Education */}
                <div>
                    <h3>Education</h3>
                    {user.education.map((edu, index) => (
                        <p key={index}>
                            <strong>{edu.period}</strong><br />
                            {edu.degree}<br />
                            {edu.institution}
                        </p>
                    ))}
                </div>
            </section>
        </div>
    );
}

// export the Profile component so it can be used in other parts of the app
export default Profile;