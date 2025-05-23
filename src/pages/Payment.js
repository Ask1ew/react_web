import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PaymentForm from "../components/PaymentForm";
import { CartContext } from "../context/CartContext";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/products.css";

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

function Payment() {
    const { cartItems } = useContext(CartContext);
    const { darkMode } = useContext(PreferencesContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfos, promoCode, discount } = location.state || {};
    const isLoggedIn = !!localStorage.getItem("token");

    const [clientSecret, setClientSecret] = useState(null);

    const total = Object.values(cartItems).reduce(
        (sum, item) => sum + item.price * item.count,
        0
    );
    const discountValue = typeof discount === "number" ? discount : 0;
    const discountedTotal = total * (1 - discountValue);

    useEffect(() => {
        // Appel à ton backend pour créer le PaymentIntent et récupérer le clientSecret
        fetch("http://localhost:3001/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: Math.round(discountedTotal * 100) }) // montant en centimes
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
    }, [discountedTotal]);

    if (!isLoggedIn) {
        navigate("/login", { state: { from: "payment" } });
        return null;
    }

    if (!userInfos) {
        navigate("/checkout");
        return null;
    }

    const options = clientSecret ? { clientSecret } : undefined;

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
                                    <span>{item.name} x {item.count}</span>
                                    <span>{(item.price * item.count).toFixed(2)}€</span>
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
                        <h2>Paiement sécurisé</h2>
                        {clientSecret && (
                            <Elements stripe={stripePromise} options={options}>
                                <PaymentForm />
                            </Elements>
                        )}
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Payment;
