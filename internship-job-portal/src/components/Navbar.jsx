// use Navbar component to display navigation links
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    // Get logged-in user
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <header>
            <h1>Internship & Job Portal for Students</h1>
            <nav>
                {/* Link to Homepage */}
                <Link to="/">Home</Link>

                {/* Link to Jobs page */}
                <Link to="/jobs">Jobs</Link>

                {/* Link to Internships page */}
                <Link to="/internships">Internships</Link>

                {/* NOT LOGGED IN */}
                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {/* Logged in as Student */}
                {user && user.role === "Student" && (
                    <>
                        <Link to="/profile">Profile</Link>
                        <span style={{ marginLeft: "10px" }}>Welcome, {user.name}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}

                {/* Logged in as Company or Admin */}
                {user && (user.role === "Company" || user.role === "Admin") && (
                    <>
                        <Link to="/company/jobs">My Jobs</Link>
                        <Link to="/company/create-job">Create Jobs</Link>
                        <span style={{ marginLeft: "10px" }}>Welcome, {user.name}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </nav>
        </header>
    );
}

// export the Navbar component so it can be used in other parts of the app
export default Navbar;