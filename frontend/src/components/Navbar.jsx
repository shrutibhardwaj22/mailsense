import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        📧 MailSense
      </div>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/pricing" className="navbar-link">Pricing</Link>
      </div>
    </nav>
  );
}

export default Navbar;