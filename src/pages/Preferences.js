import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import { LanguageContext } from "../context/LanguageContext";
import { DeviseContext } from "../context/DeviseContext";
import '../styles/preferences.css';
import Breadcrumb from "../components/Breadcrumb";

function Preferences() {
    const { darkMode, setDarkMode } = useContext(PreferencesContext);
    const { language, setLanguage } = useContext(LanguageContext);
    const { devise, setDevise } = useContext(DeviseContext);
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
    const handleDeviseChange = (dev) => setDevise(dev);

    return (
        <div className={`preferences-root ${darkMode ? "dark-mode" : "light-mode"}`}>
            <Header />
            <div className={`main-content about-page ${darkMode ? "dark-mode" : "light-mode"}`}>
                <Breadcrumb items={[
                    { label: "Accueil", to: "/" },
                    { label: "Préférences" }
                ]} />
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
                <h2>Devise</h2>
                <ul className="theme-options">
                    <li>
                        <strong>Euro (€)&nbsp;:</strong>
                        <button
                            className={`toggle-button ${devise === "EUR" ? "on" : "off"}`}
                            onClick={() => handleDeviseChange("EUR")}
                        >
                            {devise === "EUR" ? "ON" : "OFF"}
                        </button>
                    </li>
                    <li>
                        <strong>Dollar ($)&nbsp;:</strong>
                        <button
                            className={`toggle-button ${devise === "USD" ? "on" : "off"}`}
                            onClick={() => handleDeviseChange("USD")}
                        >
                            {devise === "USD" ? "ON" : "OFF"}
                        </button>
                    </li>
                    <li>
                        <strong>Livre (£)&nbsp;:</strong>
                        <button
                            className={`toggle-button ${devise === "GBP" ? "on" : "off"}`}
                            onClick={() => handleDeviseChange("GBP")}
                        >
                            {devise === "GBP" ? "ON" : "OFF"}
                        </button>
                    </li>
                </ul>
            </div>
            <Footer />
        </div>
    );
}

export default Preferences;