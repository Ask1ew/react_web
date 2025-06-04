import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/gestionnaire.css";

import GestionComptes from "../components/gestionnaire/GestionComptes";
import GestionArticles from "../components/gestionnaire/GestionArticles";
import GestionPrestations from "../components/gestionnaire/GestionPrestations";
import GestionCommandes from "../components/gestionnaire/GestionCommandes";
import GestionPromotions from "../components/gestionnaire/GestionPromotions";
import GestionLitiges from "../components/gestionnaire/GestionLitiges";
import GestionFidelite from "../components/gestionnaire/GestionFidelite";
import GestionAvis from "../components/gestionnaire/GestionAvis";
import GestionAccueil from "../components/gestionnaire/GestionAccueil";
import GestionLivreDor from "../components/gestionnaire/GestionLivreDor";

const onglets = [
    { key: "comptes", label: "Gestion des comptes" },
    { key: "articles", label: "Gestion des articles" },
    { key: "prestations", label: "Gestion des prestations" },
    { key: "commandes", label: "Commandes" },
    { key: "promotions", label: "Promotions" },
    { key: "litiges", label: "Litiges" },
    { key: "fidelite", label: "Points fidélité" },
    { key: "avis", label: "Modération des avis" },
    { key: "accueil", label: "Accueil & Mise en avant" },
    { key: "livredor", label: "Livre d'or" },
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
                    navigate("/");
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
                    {onglet === "prestations" && <GestionPrestations />}
                    {onglet === "commandes" && <GestionCommandes />}
                    {onglet === "promotions" && <GestionPromotions />}
                    {onglet === "litiges" && <GestionLitiges />}
                    {onglet === "fidelite" && <GestionFidelite />}
                    {onglet === "avis" && <GestionAvis />}
                    {onglet === "accueil" && <GestionAccueil />}
                    {onglet === "livredor" && <GestionLivreDor />}
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Gestionnaire;
