import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PreferencesContext } from "../context/PreferencesContext";
import { DeviseContext } from "../context/DeviseContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import "../styles/promotion.css";
import Breadcrumb from "../components/Breadcrumb";

const DEVISE_SYMBOLS = { EUR: '€', USD: '$', GBP: '£' };
const DEVISE_RATES = { EUR: 1, USD: 1.1, GBP: 0.85 };

function getColumnsPerRow() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 4;
}

function Promotion() {
    const { addToCart } = useCart();
    const { darkMode } = useContext(PreferencesContext);
    const { devise } = useContext(DeviseContext);
    const navigate = useNavigate();

    const [itemList, setItemList] = useState([]);
    const [featuredIds, setFeaturedIds] = useState([]);
    const [columnsPerRow, setColumnsPerRow] = useState(getColumnsPerRow());
    const [currentPageGlobal, setCurrentPageGlobal] = useState(1);
    const itemsPerPage = columnsPerRow * 2;

    useEffect(() => {
        const handleResize = () => setColumnsPerRow(getColumnsPerRow());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Récupérer la liste des produits
    useEffect(() => {
        fetch('http://localhost:3001/produits')
            .then(res => res.json())
            .then(data => setItemList(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Erreur chargement articles:", err);
                setItemList([]);
            });
    }, []);

    // Récupérer la sélection des produits mis en avant
    useEffect(() => {
        fetch('http://localhost:3001/promotion/selection', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.produits)) setFeaturedIds(data.produits);
                else setFeaturedIds([]);
            })
            .catch(err => {
                console.error("Erreur chargement sélection:", err);
                setFeaturedIds([]);
            });
    }, []);

    // Produits en promotion
    const produitsEnPromo = itemList.filter(item => item.onSale && item.onSale > 0);

    // Produits mis en avant ET en promotion (trouvés parmi les produits en promo)
    const produitsMisEnAvant = produitsEnPromo.filter(item => featuredIds.includes(item.id));

    // Produits en promotion non mis en avant
    const produitsPromoGlobale = produitsEnPromo.filter(item => !featuredIds.includes(item.id));

    // Pagination pour les promotions globales
    const indexOfLastItemGlobal = currentPageGlobal * itemsPerPage;
    const indexOfFirstItemGlobal = indexOfLastItemGlobal - itemsPerPage;
    const currentItemsGlobal = produitsPromoGlobale.slice(indexOfFirstItemGlobal, indexOfLastItemGlobal);
    const totalPagesGlobal = Math.ceil(produitsPromoGlobale.length / itemsPerPage);

    const convertPrice = (price) => {
        const rate = DEVISE_RATES[devise] || 1;
        return (price * rate).toFixed(2);
    };

    const showDetails = (item) => {
        navigate('/detail', { state: { item } });
    };

    const renderItem = (item) => {
        const reduction = item.onSale;
        const priceOriginal = Number(convertPrice(item.price));
        const priceFinal = Number(convertPrice(item.price * (1 - reduction / 100)));
        const isFeatured = featuredIds.includes(item.id);

        return (
            <li key={item.id} className={`item ${darkMode ? 'dark-mode' : ''} ${isFeatured ? 'featured' : ''}`}>
                <div className={`info-icon ${darkMode ? 'dark-mode' : ''}`} onClick={() => showDetails(item)}>
                    i
                </div>
                {isFeatured && <span className="featured-badge">MIS EN AVANT</span>}
                <img src={item.image} alt={item.name} className="item-image" />
                <h3>{item.name}</h3>
                <div className="price-zone">
                    <div className={`price-tag ${darkMode ? 'dark-mode' : ''} on-sale`}>
                        <span className="old-price">
                            <del>{priceOriginal.toFixed(2)}{DEVISE_SYMBOLS[devise]}</del>
                        </span>
                        <span className="new-price">
                            {priceFinal.toFixed(2)}{DEVISE_SYMBOLS[devise]}
                        </span>
                        <span className="discount-badge">-{reduction}%</span>
                    </div>
                </div>
                <button
                    className={`add-btn ${darkMode ? 'dark-mode' : ''}`}
                    onClick={() => addToCart(item)}
                >
                    Ajouter
                </button>
            </li>
        );
    };

    return (
        <div className={`promotion-page ${darkMode ? 'dark-mode' : ''}`}>
            <Header />
            <main className="promotion-main">
                <Breadcrumb items={[
                    { label: "Produits", to: "/products" },
                    { label: "Détails" }
                ]} />
                <h2>Promotions en cours</h2>
                <p>Profitez des offres spéciales sur nos meilleurs produits !</p>

                {/* SECTION : PRODUITS MIS EN AVANT */}
                {produitsMisEnAvant.length > 0 && (
                    <section className="promotion-section">
                        <h3 className="promotion-section-title">Produits mis en avant</h3>
                        <p className="promotion-section-desc">
                            Sélectionnés par notre équipe pour vous offrir le meilleur des promotions.
                        </p>
                        <ul className="item-list">
                            {produitsMisEnAvant.map(renderItem)}
                        </ul>
                    </section>
                )}

                {/* SECTION : PROMOTIONS GLOBALES */}
                {produitsPromoGlobale.length > 0 ? (
                    <section className="promotion-section">
                        <h3 className="promotion-section-title">Toutes les promotions</h3>
                        <p className="promotion-section-desc">
                            Découvrez toutes les offres spéciales disponibles.
                        </p>
                        <ul className="item-list">
                            {currentItemsGlobal.map(renderItem)}
                        </ul>
                        {produitsPromoGlobale.length > itemsPerPage && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPageGlobal(Math.max(1, currentPageGlobal - 1))}
                                    disabled={currentPageGlobal === 1}
                                >
                                    Précédent
                                </button>
                                <span>Page {currentPageGlobal} / {totalPagesGlobal}</span>
                                <button
                                    onClick={() => setCurrentPageGlobal(Math.min(totalPagesGlobal, currentPageGlobal + 1))}
                                    disabled={currentPageGlobal === totalPagesGlobal || totalPagesGlobal === 0}
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </section>
                ) : produitsEnPromo.length === 0 ? (
                    <p className="no-result">Aucun produit en promotion pour le moment.</p>
                ) : null}
            </main>
            <Cart />
            <Footer />
        </div>
    );
}

export default Promotion;
