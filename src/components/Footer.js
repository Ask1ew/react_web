import React, { useContext, useEffect, useState } from 'react';
import '../styles/footer.css';
import { Link } from 'react-router-dom';
import { PreferencesContext } from '../context/PreferencesContext';

function Footer() {
    const { darkMode } = useContext(PreferencesContext);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('token'));
        window.addEventListener('storage', checkLogin);
        checkLogin();
        return () => window.removeEventListener('storage', checkLogin);
    }, []);

    return (
        <footer className={`footer${darkMode ? ' dark-mode' : ''}`}>
            <div className="footer-content">
                <div className="footer-section">
                    <h3>À propos de Galactic Burgers</h3>
                    <p>Des burgers cosmiques pour des saveurs stellaires&nbsp;!</p>
                </div>
                <div className="footer-section">
                    <h3>Liens rapides</h3>
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        {isLoggedIn && <li><Link to="/preferences">Préférences</Link></li>}
                        <li><Link to="/contact">Contact</Link></li>
                        {isLoggedIn
                            ? <li><Link to="/profile">Votre Profil</Link></li>
                            : <li><Link to="/login">Connexion</Link></li>
                        }
                        <li><Link to="/litiges">Litiges</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Nous contacter</h3>
                    <p>Email&nbsp;: info@galacticburgers.com</p>
                    <p>Téléphone&nbsp;: +33 1 23 45 67 89</p>
                </div>
                <div className="footer-section">
                    <h3>Suivez-nous</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 GALACTIC BURGERS. Tous droits réservés.</p>
            </div>
        </footer>
    );
}

export default Footer;