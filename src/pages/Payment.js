import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/products.css";

function Payment() {
    const { cartItems, clearCart } = useContext(CartContext);
    const { darkMode } = useContext(PreferencesContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfos = {}, discount } = location.state || {};
    const isLoggedIn = !!localStorage.getItem("token");
    const [error, setError] = useState("");

    const total = Object.values(cartItems).reduce(
        (sum, item) => {
            if (item.fidelityDiscount) return sum;
            return sum + item.price * item.count;
        },
        0
    );
    const discountValue = typeof discount === "number" ? discount : 0;
    const discountedTotal = total * (1 - discountValue);

    if (!isLoggedIn) {
        navigate("/login", { state: { from: "payment" } });
        return null;
    }

    // Envoie la commande au backend même si userInfos est vide
    const handleFakePayment = async () => {
        const commande = {
            infos: {
                nom: userInfos.nom || "",
                prenom: userInfos.prenom || "",
                email: userInfos.email || "",
                adresse: userInfos.adresse || "",
                telephone: userInfos.telephone || ""
            },
            items: Object.values(cartItems),
            total: discountedTotal.toFixed(2)
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3001/commandes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(commande)
            });

            if (response.ok) {
                const data = await response.json();
                clearCart();
                navigate("/confirmation", { state: { commande: data.commande } });
            } else {
                setError("Erreur lors de l'enregistrement de la commande.");
            }
        } catch (e) {
            setError("Erreur réseau.");
        }
    };

    return (
        <>
            <Header />
            <div className={`checkout-page${darkMode ? " dark-mode" : ""}`}>
                <div className="checkout-steps">
                    <div className="step">
                        <span>1</span>
                        <p>Détails</p>
                    </div>
                    <div className="step active">
                        <span>2</span>
                        <p>Paiement</p>
                    </div>
                    <div className="step">
                        <span>3</span>
                        <p>Confirmation</p>
                    </div>
                </div>

                <h1>Paiement</h1>
                <div className="checkout-content">
                    <section className="checkout-summary">
                        <h2>Résumé de la commande</h2>
                        <ul>
                            {Object.values(cartItems).map((item) => (
                                <li key={item.id}>
                                    <span>
                                        {item.name} x {item.count}
                                        {item.fidelityDiscount && (
                                            <span style={{ color: "#04AA6D", fontWeight: "bold", marginLeft: 6 }}>
                                                (Fidélité)
                                            </span>
                                        )}
                                    </span>
                                    <span>
                                        {item.fidelityDiscount
                                            ? "0.00€"
                                            : (item.price * item.count).toFixed(2) + "€"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="checkout-total">
                            {discountValue > 0 ? (
                                <>
                                    <span className="old-price"><del>{total.toFixed(2)}€</del></span>
                                    <span className="new-price">{discountedTotal.toFixed(2)}€</span>
                                    <span className="discount-badge">-{Math.round(discountValue * 100)}%</span>
                                </>
                            ) : (
                                <span className="new-price">{total.toFixed(2)}€</span>
                            )}
                        </div>
                    </section>
                    <section className="checkout-infos">
                        <h2>Paiement simulé</h2>
                        <p>
                            (Aucune transaction réelle n'est effectuée. Cliquez sur "Valider le paiement" pour simuler une commande.)
                        </p>
                        {error && <div className="payment-error">{error}</div>}
                        <div style={{ display: "flex", gap: "18px", marginTop: "18px" }}>
                            <button
                                type="button"
                                className="checkout-btn"
                                onClick={() => navigate(-1)}
                            >
                                Retour
                            </button>
                            <button
                                type="button"
                                className="checkout-btn"
                                onClick={handleFakePayment}
                            >
                                Valider le paiement
                            </button>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Payment;
