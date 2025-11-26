import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navbar-header">
            <div className="logo">
                <Link to="/">
                    <img src="/images/stylerLogo.png" alt="Styler Logo" />
                </Link>
            </div>

            <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>

            <nav className={`nav-bar ${isMenuOpen ? 'active' : ''}`}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><a href="#about">About Us</a></li>
                    <li><Link to="/services">Services</Link></li>

                    {!isAuthenticated() ? (
                        <li><Link to="/login">Signup/Login</Link></li>
                    ) : isAdmin() ? (
                        <>
                            <li><Link to="/admin/dashboard">Dashboard</Link></li>
                            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/profile">My Profile</Link></li>
                            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
