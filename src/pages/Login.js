import React, {useContext, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginDetail from '../components/LoginDetail';
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/login.css';

function Login() {
    const { darkMode } = useContext(PreferencesContext);

    const handleLogin = (event) => {
        event.preventDefault();
        console.log("Login en cours...");
    };

    const handleSignup = (event) => {
        event.preventDefault();
        console.log("Inscription en cours...");
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/profile';
        }
    }, []);

    return (
        <div className={`connexion-root ${darkMode ? "dark-mode" : "light-mode"}`}>
            <Header />
            <LoginDetail />
            <div className="connexion-inscription-page">
                <div className="form-container">
                    <div className="form-box">
                        <h2>Connexion</h2>
                        <form className="connexion-form" onSubmit={handleLogin}>
                            <label htmlFor="login-email">Adresse e-mail :</label>
                            <input
                                type="email"
                                id="login-email"
                                name="email"
                                placeholder="Entrez votre adresse e-mail"
                                required
                            />

                            <label htmlFor="login-password">Mot de passe :</label>
                            <input
                                type="password"
                                id="login-password"
                                name="password"
                                placeholder="Entrez votre mot de passe"
                                required
                            />

                            <button type="submit" className="connexion-button">Se connecter</button>
                        </form>
                    </div>

                    <div className="form-box">
                        <h2>Inscription</h2>
                        <form className="inscription-form" onSubmit={handleSignup}>
                            <label htmlFor="signup-name">Nom :</label>
                            <input
                                type="text"
                                id="signup-name"
                                name="name"
                                placeholder="Entrez votre nom"
                                required
                            />

                            <label htmlFor="signup-email">Adresse e-mail :</label>
                            <input
                                type="email"
                                id="signup-email"
                                name="email"
                                placeholder="Entrez votre adresse e-mail"
                                required
                            />

                            <label htmlFor="signup-password">Mot de passe :</label>
                            <input
                                type="password"
                                id="signup-password"
                                name="password"
                                placeholder="Créez un mot de passe"
                                required
                            />

                            <button type="submit" className="inscription-button">S'inscrire</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
