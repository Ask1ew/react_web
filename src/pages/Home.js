import React, { useContext, useState, useEffect } from 'react';
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

    const [featured, setFeatured] = useState({ produits: [], prestations: [], offres: [] });
    const [produits, setProduits] = useState([]);
    const [prestations, setPrestations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const locations = [
        { lat: 48.8566, lng: 2.3522, name: "Paris" },
        { lat: 47.4784, lng: -0.5632, name: "Angers" }
    ];

    const openMaps = (lat, lng, name) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    };

    // Fonction pour charger les données
    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Récupérer les produits
            const produitsRes = await fetch("http://localhost:3001/produits");
            if (!produitsRes.ok) throw new Error("Erreur produits");
            setProduits(await produitsRes.json());

            // 2. Récupérer les prestations
            const prestationsRes = await fetch("http://localhost:3001/prestations");
            if (!prestationsRes.ok) throw new Error("Erreur prestations");
            setPrestations(await prestationsRes.json());

            // 3. Récupérer la sélection accueil (si besoin d'authentification, on ignore)
            try {
                const token = localStorage.getItem("token");
                const selectionRes = await fetch("http://localhost:3001/accueil/selection", {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {}
                });
                if (selectionRes.ok) {
                    const selectionData = await selectionRes.json();
                    setFeatured({
                        produits: Array.isArray(selectionData.produits) ? selectionData.produits : [],
                        prestations: Array.isArray(selectionData.prestations) ? selectionData.prestations : [],
                        offres: Array.isArray(selectionData.offres) ? selectionData.offres : []
                    });
                }
            } catch (err) {
                // Si erreur 401 ou autre, on ignore et on garde les tableaux vides
                setFeatured({ produits: [], prestations: [], offres: [] });
            }
        } catch (err) {
            setError(err.message || "Erreur lors du chargement des données");
            setFeatured({ produits: [], prestations: [], offres: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
        const handleScroll = () => {
            const elements = document.querySelectorAll('.slide-in, .fade-in');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = (rect.top <= window.innerHeight * 0.8) && (rect.bottom >= 0);
                if (isVisible) {
                    el.classList.add('active');
                }
            });
        };
        handleScroll();
        // Écouteur d’événement pour le défilement
        window.addEventListener('scroll', handleScroll);

        // Nettoyage de l’écouteur
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Trouver un élément par son id
    const getItem = (type, id) => {
        if (type === "produits") return produits.find(p => p.id === id); // Utiliser == pour compatibilité avec certains backend
        if (type === "prestations") return prestations.find(p => p.id === id);
        return null;
    };

    if (loading) return <div className="home-root">Chargement en cours...</div>;
    if (error) return <div className="home-root">Erreur : {error}</div>;

    return (
        <div className={`home-root ${darkMode ? 'dark-mode' : ''}`}>
            <Header />
            <main className="home-main">
                <section className="home-hero">
                    <img
                        src="http://localhost:3001/images/galactic_burgers_logo.png"
                        alt="Logo Galactic Burgers"
                        className="home-hero-logo"
                    />
                    <h1 className="home-title">{t.title}</h1>
                    <p className="home-slogan">{t.slogan}</p>
                </section>

                {/* Produits mis en avant */}
                {featured.produits && featured.produits.length > 0 && (
                    <section className="home-featured-section">
                        <h2>{t.featuredProductsTitle || "Produits mis en avant"}</h2>
                        <div className="home-featured-grid">
                            {featured.produits.map(id => {
                                const produit = getItem("produits", id);
                                if (!produit) return null;
                                return (
                                    <div key={id} className="home-featured-item">
                                        <img
                                            src={produit.image}
                                            alt={produit.name}
                                            className="home-featured-image"
                                        />
                                        <h3>{produit.name}</h3>
                                        <p>{produit.price} €</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Prestations mises en avant */}
                {featured.prestations && featured.prestations.length > 0 && (
                    <section className="home-featured-section">
                        <h2>{t.featuredServicesTitle || "Prestations mises en avant"}</h2>
                        <div className="home-featured-grid">
                            {featured.prestations.map(id => {
                                const prestation = getItem("prestations", id);
                                if (!prestation) return null;
                                return (
                                    <div key={id} className="home-featured-item">
                                        <img
                                            src={prestation.image}
                                            alt={prestation.titre}
                                            className="home-featured-image"
                                        />
                                        <h3>{prestation.titre}</h3>
                                        <p>{prestation.prix} €</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                <section className="home-section slide-in">
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

                <section className="home-section reverse fade-in">
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

                <section className="home-section slide-in">
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

                <section className="home-map-section">
                    <h2>{t.mapTitle}</h2>
                    <div className="home-map-container">
                        <div className="home-map-iframe">
                            <iframe
                                title="Carte interactive"
                                src={`https://maps.google.com/maps?q=${locations[0].lat},${locations[0].lng}&hl=${language}&z=13&output=embed`}
                                width="100%"
                                height="400"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                                aria-hidden="false"
                                tabIndex="0"
                            />
                        </div>
                        <div className="home-map-markers">
                            {locations.map((loc, idx) => (
                                <button
                                    key={idx}
                                    className="home-map-marker"
                                    onClick={() => openMaps(loc.lat, loc.lng, loc.name)}
                                >
                                    {loc.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

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
