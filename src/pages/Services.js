import React, { useContext } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import ServiceList from "../components/ServiceList";

function Services() {
    const { darkMode } = useContext(PreferencesContext);

    return (
        <div className={darkMode ? "dark-mode" : "light-mode"}>
            <Header />
            <div className="main-content">
                <div className="container">
                    <div className="content">
                        <ServiceList />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Services;
