import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/detail.css';
import { useLocation } from 'react-router-dom';

function Detail() {
    const location = useLocation();
    const item = location.state?.selectedItem;

    if (!item) {
        return (
            <div>
                <Header />
                <div className="detail-container">
                    <h1>Aucun article sélectionné</h1>
                    <p>Veuillez sélectionner un article depuis la liste</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="detail-container">
                <div className="detail-title">
                    <h1>Détails du {item.name}</h1>
                </div>
                <div className="detail-content">
                    <img src={item.image} alt={item.name} className="detail-image" />
                    <div className="detail-info">
                        <p><strong>Nom :</strong> {item.name}</p>
                        <p><strong>Prix :</strong> {item.price.toFixed(2)}€</p>
                        {item.onSale && <p className="sale-alert">🏷️ Article en solde !</p>}
                        <p><strong>Description :</strong> {item.description || "Description non disponible"}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Detail;
