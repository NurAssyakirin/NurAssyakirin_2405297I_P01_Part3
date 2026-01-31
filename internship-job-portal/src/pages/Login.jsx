import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setRole }) {
    const navigate = useNavigate();
    // store variables to store user input
    const [email, setEmail] = useState(""); // store user's email
    const [password, setPassword] = useState(""); // store user's password
    const [type, setType] = useState("Student"); // store user role (student or company)

    // function to handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // prevent page reload when submitting the form

        try {
            // send POST request to backend login endpoint
            const res = await fetch("http://localhost:5050/auth/login", {
                method: "POST",
                // telling the backend that i am sending a JSON data
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, type }), // convert login data to JSON
            });

            // Check if response is in JSON format
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json(); // parse JSON response from backend
            } else {
                const text = await res.text();
                console.error("Unexpected server response:", text);
                throw new Error("Server returned non-JSON response");
            }

            // if login failed, show error message returned by backend
            if (!res.ok) {
                alert(data.error || "Login failed");
                return;
            }

            // Save user info in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("role", data.user.role);

            // update app state with the user role
            setRole(data.user.role);
            alert(`Welcome ${data.user.name}!`);

            // Redirect based on user role
            if (data.user.role === "Student") {
                navigate("/"); // student goes to homepage
            } else if (data.user.role === "Company") {
                navigate("/"); // go to company's dashboard
            }

        } catch (err) {
            console.error("Login error:", err);
            alert("An error occured while logging in. Please try again.");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {/* Input for Email */}
            <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            {/* Input for Password */}
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            {/* Dropdown to select user role */}
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Company">Company</option>
            </select>
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;