import { createContext, useState, useEffect } from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("darkMode");
        return savedTheme === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const resetPreferences = () => {
        setDarkMode(false); // Theme clair
        localStorage.setItem("darkMode", "false");
    };

    return (
        <PreferencesContext.Provider value={{ darkMode, setDarkMode, resetPreferences }}>
            {children}
        </PreferencesContext.Provider>
    );
};
