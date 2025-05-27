import React, { useContext, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function PaymentForm({ userInfos, promoCode, discount, cartItems }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {},
            redirect: "if_required"
        });

        if (error) {
            setErrorMsg(error.message || "Erreur lors du paiement.");
            return;
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3001/commandes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    infos: userInfos,
                    items: Object.values(cartItems),
                    total: paymentIntent.amount / 100,
                    promoCode,
                    discount
                })
            });
            if (response.ok) {
                const data = await response.json();
                clearCart();
                navigate("/confirmation", { state: { commande: data.commande } });
            } else {
                setErrorMsg("Erreur lors de l'enregistrement de la commande.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <PaymentElement />
            {errorMsg && <div className="payment-error">{errorMsg}</div>}
            <div style={{ display: "flex", gap: "18px", marginTop: "18px" }}>
                <button type="button" className="checkout-btn" onClick={() => navigate(-1)}>
                    Retour
                </button>
                <button type="submit" className="checkout-btn" disabled={!stripe}>
                    Payer
                </button>
            </div>
        </form>
    );
}

export default PaymentForm;
