import React, { useState, useEffect } from 'react';
import '../styles/header.css';
import logo from '../assets/galactic_burgers_logo.jpg';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navigateTo = (path) => {
        window.location.href = path;
        setIsMenuOpen(false);
    };

    return (
        <div className='header'>
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
                            <button className="nav-button" onClick={() => navigateTo('/')}>Accueil</button>
                            <button className="nav-button" onClick={() => navigateTo('/preferences')}>Préférences</button>
                            <button className="nav-button" onClick={() => navigateTo('/about')}>À propos</button>
                            <button className="nav-button" onClick={() => navigateTo('/contact')}>Contact</button>
                            <button className="nav-button" onClick={() => navigateTo('/connexion')}>Se connecter</button>
                        </nav>
                    )}
                </>
            ) : (
                <nav className='nav-links'>
                    <button className="nav-button" onClick={() => navigateTo('/')}>Accueil</button>
                    <button className="nav-button" onClick={() => navigateTo('/preferences')}>Préférences</button>
                    <button className="nav-button" onClick={() => navigateTo('/about')}>À propos</button>
                    <button className="nav-button" onClick={() => navigateTo('/contact')}>Contact</button>
                    <button className="nav-button" onClick={() => navigateTo('/connexion')}>Se connecter</button>
                </nav>
            )}
        </div>
    );
}

export default Header;
