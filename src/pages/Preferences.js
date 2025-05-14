import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import { LanguageContext } from "../context/LanguageContext";
import '../styles/preferences.css';

function Preferences() {
    const { darkMode, setDarkMode } = useContext(PreferencesContext);
    const { language, setLanguage } = useContext(LanguageContext);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    if (isLoggedIn === null) return null;
    if (!isLoggedIn) {
        window.location.href = "/login";
        return null;
    }

    const handleThemeChange = (theme) => setDarkMode(theme === "dark");
    const handleLanguageChange = (lang) => setLanguage(lang);

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
                <h2>Langue</h2>
                <ul className="theme-options">
                    <li>
                        <strong>Français :</strong>
                        <button
                            className={`toggle-button ${language === "fr" ? "on" : "off"}`}
                            onClick={() => handleLanguageChange("fr")}
                        >
                            {language === "fr" ? "ON" : "OFF"}
                        </button>
                    </li>
                    <li>
                        <strong>Anglais :</strong>
                        <button
                            className={`toggle-button ${language === "en" ? "on" : "off"}`}
                            onClick={() => handleLanguageChange("en")}
                        >
                            {language === "en" ? "ON" : "OFF"}
                        </button>
                    </li>
                </ul>
            </div>
            <Footer />
        </div>
    );
}

export default Preferences;
