import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin + "/confirmation" }
        });

        if (error) {
            setMessage(error.message);
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button className="checkout-btn" disabled={isLoading || !stripe || !elements}>
                {isLoading ? "Traitement..." : "Payer"}
            </button>
            {message && <div className="checkout-error">{message}</div>}
        </form>
    );
}

export default PaymentForm;
