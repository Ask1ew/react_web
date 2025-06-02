import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/products.css";

function Confirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const commande = location.state?.commande;

    if (!commande) {
        navigate("/");
        return null;
    }

    const promoCode = commande.promoCode || commande.promocode || "";
    const discount = typeof commande.discount === "number"
        ? commande.discount
        : (commande.discountPercent ? commande.discountPercent / 100 : 0);

    const discountPercent = discount > 0 ? Math.round(discount * 100) : 0;

    const totalAvantRemise = discount > 0
        ? (Number(commande.total) / (1 - discount))
        : Number(commande.total);

    return (
        <>
            <Header />
            <div className="confirmation-page">
                <div className="checkout-steps">
                    <div className="step">
                        <span>1</span>
                        <p>Détails</p>
                    </div>
                    <div className="step">
                        <span>2</span>
                        <p>Paiement</p>
                    </div>
                    <div className="step active">
                        <span>3</span>
                        <p>Confirmation</p>
                    </div>
                </div>
                <h1>Commande confirmée !</h1>
                <p>Merci pour votre achat. Voici les détails de votre commande :</p>
                <div className="confirmation-details">
                    <p><strong>Numéro de commande :</strong> {commande.id}</p>
                    <p><strong>Date :</strong> {commande.date_creation ? new Date(commande.date_creation).toLocaleString() : "-"}</p>
                    <p><strong>Total :</strong> {commande.total} €</p>
                    <p><strong>Adresse de livraison :</strong> {commande.adresse || "-"}</p>

                    {/* Affichage du code promo et du pourcentage de réduction */}
                    {promoCode && discountPercent > 0 && (
                        <p>
                            <strong>Code promotionnel utilisé :</strong> <span className="promo-code">{promoCode}</span>
                            {" "}(<span className="discount-badge">-{discountPercent}%</span>)
                        </p>
                    )}

                    {/* Affichage du total avant remise si promo */}
                    {discountPercent > 0 && (
                        <p>
                            <span className="old-price">
                                <del>{totalAvantRemise.toFixed(2)}€</del>
                            </span>
                            <span className="new-price" style={{ marginLeft: 8 }}>
                                {Number(commande.total).toFixed(2)}€
                            </span>
                        </p>
                    )}

                    <ul>
                        {commande.items && commande.items.map((item, idx) => (
                            <li key={idx}>
                                {item.name} x{item.count}
                                {item.fidelityDiscount && (
                                    <span style={{ color: "#04AA6D", fontWeight: "bold", marginLeft: 6 }}>
                                        (Fidélité)
                                    </span>
                                )}
                                {" — "}
                                {item.fidelityDiscount
                                    ? "0.00 €"
                                    : (item.price * item.count).toFixed(2) + " €"}
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="checkout-btn" onClick={() => navigate("/")}>
                    Retour à la boutique
                </button>
            </div>
            <Footer />
        </>
    );
}

export default Confirmation;
