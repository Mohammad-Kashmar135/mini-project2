import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="layout-navbar">
      <div className="layout-navbar__container">
        <Link to="/" className="layout-navbar__brand">
          ⚽ Football Pitch Booking
        </Link>
        <div className="layout-navbar__links">
          <Link to="/" className="layout-navbar__link">
            Pitches
          </Link>
          <Link to="/my-booking" className="layout-navbar__link">
            My Booking
          </Link>
        </div>
      </div>
    </nav>
  );
}
