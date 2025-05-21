import React, { useContext } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import ServiceList from "../components/ServiceList";
import Agenda from "../components/Agenda";
import '../styles/services.css';

function Services() {
    const { darkMode } = useContext(PreferencesContext);

    return (
        <div className={darkMode ? "dark-mode" : "light-mode"}>
            <Header />
            <div className="services-layout">
                <div className="services-list-section">
                    <ServiceList />
                </div>
                <div className="agenda-section">
                    <Agenda />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Services;
