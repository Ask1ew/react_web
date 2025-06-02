import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/gestionnaire.css";

import GestionComptes from "../components/gestionnaire/GestionComptes";
import GestionArticles from "../components/gestionnaire/GestionArticles";
// import GestionPrestations from "../components/gestionnaire/GestionPrestations";
// import GestionReservations from "../components/gestionnaire/GestionReservations";

const onglets = [
    { key: "comptes", label: "Gestion des comptes" },
    { key: "articles", label: "Gestion des articles" },
    { key: "prestations", label: "Gestion des prestations" },
    { key: "reservations", label: "Réservations" },
    { key: "commandes", label: "Commandes" },
    { key: "stock", label: "Stock" },
    { key: "stats", label: "Statistiques" },
    { key: "promotions", label: "Promotions" },
    { key: "litiges", label: "Litiges" },
    { key: "fidelite", label: "Points fidélité" },
    { key: "avis", label: "Modération des avis" },
    { key: "accueil", label: "Accueil & Mise en avant" },
];

function Gestionnaire() {
    const [onglet, setOnglet] = useState("comptes");
    const [loading, setLoading] = useState(true);
    const [isGestionnaire, setIsGestionnaire] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetch("http://localhost:3001/profile", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Non autorisé");
                return res.json();
            })
            .then(data => {
                if (data.statut === "gestionnaire") {
                    setIsGestionnaire(true);
                } else {
                    navigate("/"); // Redirection si pas gestionnaire
                }
            })
            .catch(() => {
                navigate("/login");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) {
        return (
            <div className="gestionnaire-root">
                <Header />
                <div style={{ padding: 40, textAlign: "center" }}>Chargement...</div>
                <Footer />
            </div>
        );
    }

    if (!isGestionnaire) {
        // Sécurité supplémentaire (ne devrait jamais s'afficher)
        return null;
    }

    return (
        <div className="gestionnaire-root">
            <Header />
            <div className="gestionnaire-main">
                <aside className="gestionnaire-menu">
                    <ul>
                        {onglets.map(o => (
                            <li
                                key={o.key}
                                className={onglet === o.key ? "active" : ""}
                                onClick={() => setOnglet(o.key)}
                            >
                                {o.label}
                            </li>
                        ))}
                    </ul>
                </aside>
                <section className="gestionnaire-content">
                    {onglet === "comptes" && <GestionComptes />}
                    {onglet === "articles" && <GestionArticles />}
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Gestionnaire;
