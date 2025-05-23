import React, { useContext } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../datas/translations";
import '../styles/index.css';

function Home() {
    const { darkMode } = useContext(PreferencesContext);
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    return (
        <div className={`home-root ${darkMode ? 'dark-mode' : ''}`}>
            <Header />
            <main className="home-main">
                {/* Bloc d'accroche */}
                <section className="home-hero">
                    <img
                        src="http://localhost:3001/images/galactic_burgers_logo.png"
                        alt="Logo Galactic Burgers"
                        className="home-hero-logo"
                    />
                    <h1 className="home-title">{t.title}</h1>
                    <p className="home-slogan">{t.slogan}</p>
                </section>

                {/* Bloc présentation */}
                <section className="home-section">
                    <div className="home-section-content">
                        <h2>{t.missionTitle}</h2>
                        <p>{t.missionText}</p>
                    </div>
                    <img
                        src="http://localhost:3001/images/space_burger1.jpg"
                        alt="Burger signature"
                        className="home-section-image"
                    />
                </section>

                {/* Bloc valeurs */}
                <section className="home-section reverse">
                    <div className="home-section-content">
                        <h2>{t.valuesTitle}</h2>
                        <ul>
                            <li><strong>{t.value1}</strong></li>
                            <li><strong>{t.value2}</strong></li>
                            <li><strong>{t.value3}</strong></li>
                            <li><strong>{t.value4}</strong></li>
                        </ul>
                    </div>
                    <img
                        src="http://localhost:3001/images/space_burger2.jpg"
                        alt="Valeurs Galactic Burgers"
                        className="home-section-image"
                    />
                </section>

                {/* Bloc services */}
                <section className="home-section">
                    <div className="home-section-content">
                        <h2>{t.servicesTitle}</h2>
                        <ul>
                            <li>{t.service1}</li>
                            <li>{t.service2}</li>
                            <li>{t.service3}</li>
                            <li>{t.service4}</li>
                        </ul>
                    </div>
                    <img
                        src="http://localhost:3001/images/space_burger3.jpg"
                        alt="Food truck Galactic Burgers"
                        className="home-section-image"
                    />
                </section>

                {/* Bloc appel à l'action */}
                <section className="home-cta">
                    <h2>{t.ctaTitle}</h2>
                    <p>{t.ctaText}</p>
                    <a href="/contact" className="home-cta-btn">{t.contactBtn}</a>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
