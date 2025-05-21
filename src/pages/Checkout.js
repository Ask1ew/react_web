import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/products.css";

function Checkout() {
    const { cartItems } = useContext(CartContext);
    const { darkMode } = useContext(PreferencesContext);
    const [userInfos, setUserInfos] = useState({
        nom: "",
        prenom: "",
        email: "",
        adresse: "",
        telephone: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [showError, setShowError] = useState(false);
    const [backendError, setBackendError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        if (isLoggedIn && location.state && location.state.from === "login") {
            navigate("/checkout", { replace: true });
        }
    }, [isLoggedIn, location, navigate]);

    const total = Object.values(cartItems).reduce(
        (sum, item) => sum + item.price * item.count,
        0
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfos((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBackendError('');
        if (!isLoggedIn) {
            setShowError(true);
            setSubmitted(false);
            return;
        }
        setShowError(false);

        // Exemple d'envoi de la commande au backend
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/commandes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    infos: userInfos,
                    items: Object.values(cartItems),
                    total: total
                })
            });
            if (!response.ok) {
                const data = await response.json();
                setBackendError(data.error || "Erreur lors de la validation de la commande.");
                setSubmitted(false);
                return;
            }
            setSubmitted(true);
            setSuccessMsg("Merci pour votre commande ! Elle a bien été enregistrée.");
            // Ici tu pourrais vider le panier, rediriger, etc.
        } catch (err) {
            setBackendError("Erreur réseau. Veuillez réessayer.");
            setSubmitted(false);
        }
    };

    if (Object.values(cartItems).length === 0) {
        return (
            <>
                <Header />
                <div className={`checkout-page${darkMode ? " dark-mode" : ""}`}>
                    <h1>Votre panier est vide</h1>
                    <button className="checkout-btn" onClick={() => navigate("/")}>
                        Retour à la boutique
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className={`checkout-page${darkMode ? " dark-mode" : ""}`}>
                {/* Fil d'Ariane */}
                <div className="checkout-steps">
                    <div className="step active">
                        <span>1</span>
                        <p>Détails</p>
                    </div>
                    <div className="step">
                        <span>2</span>
                        <p>Paiement</p>
                    </div>
                    <div className="step">
                        <span>3</span>
                        <p>Confirmation</p>
                    </div>
                </div>

                <h1>Valider ma commande</h1>

                <div className="checkout-content">
                    {/* Résumé du panier */}
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
                        <p className="checkout-total">
                            Total&nbsp;: <strong>{total.toFixed(2)}€</strong>
                        </p>
                    </section>

                    {/* Formulaire infos client */}
                    <section className="checkout-infos">
                        <h2>Informations de livraison</h2>
                        {!isLoggedIn && (
                            <div className="checkout-login-box">
                                <p>Vous devez être connecté pour valider votre commande.</p>
                                <button
                                    className="checkout-btn"
                                    onClick={() => navigate("/login", { state: { from: "checkout" } })}
                                >
                                    Se connecter
                                </button>
                            </div>
                        )}
                        <hr className="checkout-separator" />
                        <form onSubmit={handleSubmit}>
                            <div className="checkout-form-row">
                                <input
                                    type="text"
                                    name="nom"
                                    placeholder="Nom"
                                    value={userInfos.nom}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!isLoggedIn}
                                />
                                <input
                                    type="text"
                                    name="prenom"
                                    placeholder="Prénom"
                                    value={userInfos.prenom}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!isLoggedIn}
                                />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={userInfos.email}
                                onChange={handleInputChange}
                                required
                                disabled={!isLoggedIn}
                            />
                            <input
                                type="text"
                                name="adresse"
                                placeholder="Adresse de livraison"
                                value={userInfos.adresse}
                                onChange={handleInputChange}
                                required
                                disabled={!isLoggedIn}
                            />
                            <input
                                type="tel"
                                name="telephone"
                                placeholder="Téléphone"
                                value={userInfos.telephone}
                                onChange={handleInputChange}
                                required
                                disabled={!isLoggedIn}
                            />
                            <button
                                className="checkout-btn"
                                type="submit"
                                disabled={!isLoggedIn}
                            >
                                Confirmer la commande
                            </button>
                            {showError && (
                                <p className="checkout-error">
                                    Vous devez être connecté pour valider votre commande.
                                </p>
                            )}
                            {backendError && (
                                <p className="checkout-error">
                                    {backendError}
                                </p>
                            )}
                            {submitted && (
                                <p className="checkout-success">
                                    {successMsg}
                                </p>
                            )}
                        </form>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Checkout;
