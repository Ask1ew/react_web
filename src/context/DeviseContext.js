import React, { createContext, useState, useEffect } from "react";

export const DeviseContext = createContext();

export const DeviseProvider = ({ children }) => {
    const [devise, setDevise] = useState(() => {
        return localStorage.getItem("devise") || "EUR";
    });

    useEffect(() => {
        localStorage.setItem("devise", devise);
    }, [devise]);

    const resetDevise = () => {
        setDevise("EUR");
        localStorage.setItem("devise", "EUR");
    };

    return (
        <DeviseContext.Provider value={{ devise, setDevise, resetDevise }}>
            {children}
        </DeviseContext.Provider>
    );
};
