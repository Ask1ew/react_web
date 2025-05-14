import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import '../styles/preferences.css';

function Preferences() {
    const { darkMode, setDarkMode } = useContext(PreferencesContext);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    if (isLoggedIn === null) {
        // Optionnel : affichage d'un loader ou rien
        return null;
    }
    if (!isLoggedIn) {
        // Redirection possible ou affichage d'un message
        window.location.href = "/login";
        return null;
    }

    const handleThemeChange = (theme) => {
        setDarkMode(theme === "dark");
    };

    return (
        <div className={`preferences-root ${darkMode ? "dark-mode" : "light-mode"}`}>
            <Header />
            <div className={`main-content about-page ${darkMode ? "dark-mode" : "light-mode"}`}>
                <h1>Préférences utilisateurs</h1>
                <h2>Thème</h2>
                <ul className="theme-options">
                    <li>
                        <strong>Sombre :</strong>
                        <button
                            className={`toggle-button ${darkMode ? "on" : "off"}`}
                            onClick={() => handleThemeChange("dark")}
                        >
                            {darkMode ? "ON" : "OFF"}
                        </button>
                    </li>
                    <li>
                        <strong>Clair :</strong>
                        <button
                            className={`toggle-button ${!darkMode ? "on" : "off"}`}
                            onClick={() => handleThemeChange("light")}
                        >
                            {!darkMode ? "ON" : "OFF"}
                        </button>
                    </li>
                </ul>
                <h2>Langage</h2>
                <ul>
                    <li><strong>Français :</strong></li>
                    <li><strong>Anglais :</strong></li>
                </ul>
            </div>
            <Footer />
        </div>
    );
}

export default Preferences;
