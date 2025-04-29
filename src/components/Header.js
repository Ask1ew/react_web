import React, { useState, useEffect, useContext } from 'react';
import '../styles/header.css';
import logo from '../assets/galactic_burgers_logo.jpg';
import { PreferencesContext } from '../context/PreferencesContext';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const { darkMode } = useContext(PreferencesContext);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('token'));
        window.addEventListener('storage', checkLogin);
        checkLogin();
        return () => window.removeEventListener('storage', checkLogin);
    }, []);

    const navigateTo = (path) => {
        window.location.href = path;
        setIsMenuOpen(false);
    };

    const loginButtonText = isLoggedIn ? "Votre Profil" : "Se connecter";
    const loginButtonPath = isLoggedIn ? "/profile" : "/login";

    const renderNavButtons = () => (
        <>
            <button className="nav-button" onClick={() => navigateTo('/')}>Accueil</button>
            <button className="nav-button" onClick={() => navigateTo('/preferences')}>Préférences</button>
            <button className="nav-button" onClick={() => navigateTo('/about')}>À propos</button>
            <button className="nav-button" onClick={() => navigateTo('/contact')}>Contact</button>
            <button className="nav-button" onClick={() => navigateTo(loginButtonPath)}>{loginButtonText}</button>
        </>
    );

    return (
        <div className={`header${darkMode ? ' dark-mode' : ''}`}>
            <div className="logo-container" onClick={() => navigateTo('/')}>
                <img src={logo} className='logo' alt="logo" />
            </div>
            <div className='title' onClick={() => navigateTo('/')}>
                <h1>GALACTIC BURGERS</h1>
            </div>
            {isMobile ? (
                <>
                    <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        ☰
                    </button>
                    {isMenuOpen && (
                        <nav className='nav-links mobile'>
                            {renderNavButtons()}
                        </nav>
                    )}
                </>
            ) : (
                <nav className='nav-links'>
                    {renderNavButtons()}
                </nav>
            )}
        </div>
    );
}

export default Header;
