import React, { createContext, useState, useEffect } from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("darkMode");
        return savedTheme === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    return (
        <PreferencesContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </PreferencesContext.Provider>
    );
};
