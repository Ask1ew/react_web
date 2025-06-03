import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/detail.css";
import Breadcrumb from "../components/Breadcrumb";

function Detail() {
    const location = useLocation();
    // Peut recevoir un produit (item) ou une prestation (service)
    const item = location.state?.item;
    const prestation = location.state?.service;
    const { darkMode } = useContext(PreferencesContext);

    // --- Affichage si rien n'est sélectionné ---
    if (!item && !prestation) {
        return (
            <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
                <Header />
                <div className="detail-container">
                    <h1>Aucun élément sélectionné</h1>
                    <p>Veuillez sélectionner un produit ou une prestation depuis la liste</p>
                </div>
                <Footer />
            </div>
        );
    }

    // --- Affichage d'une prestation ---
    if (prestation) {
        return (
            <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
                <Header />
                <div className="detail-container">
                    <div className="detail-title">
                        <h1>Détail de la prestation</h1>
                    </div>
                    <div className="detail-content">
                        <Breadcrumb items={[
                            { label: "Prestations", to: "/services" },
                            { label: "Détail" }
                        ]} /><br/>
                        <img src={prestation.image} alt={prestation.titre} className="detail-image" />
                        <div className="detail-info">
                            <p><strong>Titre :</strong> {prestation.titre}</p>
                            <p><strong>Catégorie :</strong> {prestation.categorie || '-'}</p>
                            <p><strong>Prix :</strong> {Number(prestation.prix).toFixed(2)}€</p>
                            <p><strong>Durée :</strong> {prestation.duree} min</p>
                            <p><strong>Description :</strong> {prestation.description || "Description non disponible"}</p>
                            <p><strong>Disponibilité :</strong> {prestation.disponible ? "Disponible" : "Indisponible"}</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // --- Affichage d'un produit (item) ---
    return (
        <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
            <Header />
            <div className="detail-container">
                <div className="detail-title">
                    <h1>Détails du {item.name}</h1>
                </div>
                <div className="detail-content">
                    <Breadcrumb items={[
                        { label: "Produits", to: "/products" },
                        { label: "Détails" }
                    ]} /><br/>
                    <img src={item.image} alt={item.name} className="detail-image" />
                    <div className="detail-info">
                        <p><strong>Nom :</strong> {item.name}</p>
                        <p><strong>Prix :</strong> {Number(item.price).toFixed(2)}€</p>
                        {!!item.onSale && <p className="sale-alert">🏷️ Article en solde !</p>}
                        <p><strong>Description :</strong> {item.description || "Description non disponible"}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Detail;
