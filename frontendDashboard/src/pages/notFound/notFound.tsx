import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="centered-page">
      <div className="card-section" style={{ textAlign: "center" }}>
        <h2>Page not found</h2>
        <p className="text-secondary">The page you're looking for doesn't exist.</p>
        <Link to="/login">Return to login</Link>
      </div>
    </div>
  );
}
