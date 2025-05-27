import React, { useState, useEffect, useContext } from 'react';
import '../styles/header.css';
import logo from '../assets/galactic_burgers_logo.png';
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

    const loginButtonText = isLoggedIn ? "Votre profil" : "Se connecter";
    const loginButtonPath = isLoggedIn ? "/profile" : "/login";

    const renderNavButtons = () => (
        <>
            <button className="nav-button" onClick={() => navigateTo('/products')}>Produits</button>
            <button className="nav-button" onClick={() => navigateTo('/services')}>Prestations</button>
            {isLoggedIn && (<button className="nav-button" onClick={() => navigateTo('/preferences')}>Préférences</button>)}
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
                <p className="slogan">Des burgers cosmiques pour des saveurs stellaires&nbsp;!</p>
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
            {/*!isLoggedIn && (
                <button
                    className={`dark-mode-toggle ${darkMode ? 'on' : 'off'}`}
                    onClick={toggleDarkMode}
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? '🌙' : '☀️'}
                </button>
            )*/}
        </div>
    );
}

export default Header;
