import { useState } from "react";

function Register() {
    // store variables to store user input
    const [name, setName] = useState(""); // store user's name
    const [email, setEmail] = useState(""); // store user's email
    const [password, setPassword] = useState(""); // store user's password
    const [type, setType] = useState(""); // store user role (student or company)

    // function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload when submitting the form

        // Capitalize first letter of the type to match with backend
        const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(); 

        // send a POST request to the backend register endpoint
        const res = await fetch("http://localhost:5050/auth/register", {
            method: "POST",
            // telling the backend that i am sending a JSON data
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                name,
                email,
                password,
                type: capitalizedType, // include capitalized user type
            }),
        });
        // parse JSON response from backend
        const data = await res.json();
        // if registration is successful
        if (res.ok) {
            alert("Registered successfully!");
            window.location.href = "/login"; // redirect user to login page
        } else {
            alert(data.error); // show error message from backend
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {/* input field for name */}
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            {/* input field for email */}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {/* input field for password */}
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {/* dropdown to select role */}
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Company">Company</option>
            </select>
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;