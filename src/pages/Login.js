// src/pages/Login.js
import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginDetail from '../components/LoginDetail';
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/login.css';

function Login() {
    const { darkMode } = useContext(PreferencesContext);

    return (
        <div className={`connexion-root ${darkMode ? "dark-mode" : "light-mode"}`}>
            <Header />
            <div className="connexion-inscription-page">
                <div className="form-container">
                    <div className="form-box">
                        <LoginDetail />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
