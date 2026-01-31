// use react-router-dom Link component to navigate back to home page
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="not-found-page">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className="view-details-link">Go to Home</Link>
        </div>
    );
}

export default NotFound;
