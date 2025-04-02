import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/preferences.css';

function Preferences() {
    const [darkMode, setDarkMode] = useState(false);
    const [lightMode, setLightMode] = useState(true); // Mode clair activé par défaut

    const handleThemeChange = (theme) => {
        setDarkMode(theme === "dark");
        setLightMode(theme === "light");
    };

    return (
        <div>
            <Header />
            <div
                className={`main-content about-page ${
                    darkMode ? "dark-mode" : lightMode ? "light-mode" : ""
                }`}
            >
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
                            className={`toggle-button ${lightMode ? "on" : "off"}`}
                            onClick={() => handleThemeChange("light")}
                        >
                            {lightMode ? "ON" : "OFF"}
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
