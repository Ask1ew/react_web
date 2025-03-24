import React from 'react';
import '../styles/footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>À propos de Galactic Burgers</h3>
                    <p>Des burgers cosmiques pour des saveurs stellaires !</p>
                </div>
                <div className="footer-section">
                    <h3>Liens rapides</h3>
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/menu">Menu</Link></li>
                        <li><Link to="/about">À propos</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Nous contacter</h3>
                    <p>Email: info@galacticburgers.com</p>
                    <p>Téléphone: +33 1 23 45 67 89</p>
                </div>
                <div className="footer-section">
                    <h3>Suivez-nous</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
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
