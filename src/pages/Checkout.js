import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/products.css";

function Checkout() {
    const { cartItems, clearCart } = useContext(CartContext);
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
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [discount, setDiscount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        if (isLoggedIn && location.state && location.state.from === "login") {
            navigate("/checkout", { replace: true });
        }
    }, [isLoggedIn, location, navigate]);

    // Total AVANT remise globale
    const total = Object.values(cartItems).reduce(
        (sum, item) => {
            const reduction = item.onSale > 0 && item.onSale < 100 ? item.onSale : 0;
            const priceFinal = reduction
                ? item.price * (1 - reduction / 100)
                : item.price;
            return sum + priceFinal * item.count;
        },
        0
    );

    // Remise globale (code promo)
    const discountedTotal = total * (1 - discount);
    const discountPercent = discount > 0 ? Math.round(discount * 100) : 0;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfos((prev) => ({ ...prev, [name]: value }));
    };

    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === "PROMO10") {
            setDiscount(0.10);
            setPromoError('');
        } else {
            setDiscount(0);
            setPromoError('Code promotionnel invalide.');
        }
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
                    total: discountedTotal,
                    promoCode: promoCode
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
            clearCart();
        } catch (err) {
            setBackendError("Erreur réseau. Veuillez réessayer.");
            setSubmitted(false);
        }
        navigate("/payment", {
            state: {
                userInfos,
                promoCode,
                discount
            }
        });
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
                            {Object.values(cartItems).map((item) => {
                                const reduction = item.onSale > 0 && item.onSale < 100 ? item.onSale : 0;
                                const priceOriginal = item.price * item.count;
                                const priceFinal = reduction
                                    ? item.price * (1 - reduction / 100) * item.count
                                    : priceOriginal;
                                return (
                                    <li key={item.id}>
                                        <span>{item.name} x {item.count}</span>
                                        <span>
                                            {reduction ? (
                                                <>
                                                    <span className="old-price" style={{ marginRight: 6 }}>
                                                        <del>{priceOriginal.toFixed(2)}€</del>
                                                    </span>
                                                    <span className="new-price">
                                                        {priceFinal.toFixed(2)}€
                                                    </span>
                                                    <span className="discount-badge" style={{ marginLeft: 4 }}>
                                                        -{reduction}%
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="new-price">
                                                    {priceFinal.toFixed(2)}€
                                                </span>
                                            )}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="checkout-total">
                            Total : {discount > 0 ? (
                                <>
                                    <span className="old-price" aria-label="Prix original">
                                        <del>{total.toFixed(2)}€</del>
                                    </span>
                                    <span className="new-price" aria-label="Prix remisé">
                                        {discountedTotal.toFixed(2)}€
                                    </span>
                                    <span className="discount-badge">
                                        -{discountPercent}%
                                    </span>
                                </>
                            ) : (
                                <span className="new-price">{total.toFixed(2)}€</span>
                            )}
                        </div>
                    </section>

                    {/* Formulaire infos client */}
                    <section className="checkout-infos">
                        <h2>Informations de livraison</h2>
                        <p className="checkout-info-message">
                            Merci de renseigner soigneusement vos coordonnées pour la livraison. Après validation de votre commande, vous recevrez un email récapitulatif et votre panier sera automatiquement vidé.
                        </p>
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
                            {isLoggedIn && (
                                <>
                                    <div className="checkout-form-row">
                                        <input
                                            type="text"
                                            name="promoCode"
                                            placeholder="Code promotionnel"
                                            value={promoCode}
                                            onChange={e => setPromoCode(e.target.value)}
                                            disabled={!isLoggedIn}
                                        />
                                        <button
                                            type="button"
                                            className="checkout-btn"
                                            onClick={handleApplyPromo}
                                            disabled={!isLoggedIn || !promoCode}
                                        >
                                            Appliquer
                                        </button>
                                    </div>
                                    <p className="checkout-promo-info">
                                        ⚠️ Les codes promotionnels ne peuvent pas être cumulés entre eux, mais ils peuvent s’ajouter à une promotion déjà appliquée sur un article soldé.
                                    </p>
                                </>
                            )}
                            {promoError && (
                                <p className="checkout-error">{promoError}</p>
                            )}
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
