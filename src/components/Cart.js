import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/products.css';

function Cart() {
    const { cartItems, updateQuantity } = useContext(CartContext);
    const { darkMode } = useContext(PreferencesContext);
    const navigate = useNavigate();

    const total = Object.values(cartItems).reduce((sum, item) => {
        const reduction = item.onSale > 0 && item.onSale < 100 ? item.onSale : 0;
        const finalPrice = reduction
            ? item.price * (1 - reduction / 100)
            : item.price;
        return sum + finalPrice * item.count;
    }, 0);

    const handleValidateOrder = () => {
        navigate('/checkout');
    };

    return (
        <div className={`cart${darkMode ? ' dark-mode' : ''}`}>
            <h1>Panier</h1>
            {Object.values(cartItems).length === 0 ? (
                <p>Votre panier est vide 😭</p>
            ) : (
                <>
                    <ul>
                        {Object.values(cartItems).map((item) => {
                            const reduction = item.onSale > 0 && item.onSale < 100 ? item.onSale : 0;
                            const priceOriginal = item.price;
                            const priceFinal = reduction
                                ? item.price * (1 - reduction / 100)
                                : item.price;

                            return (
                                <li key={item.id} className="cart-row">
                                    <span className="cart-col cart-name">{item.name}</span>
                                    <div className="cart-col cart-qty">
                                        <button
                                            className={`quantity-btn${darkMode ? ' dark-mode' : ''}`}
                                            onClick={() => updateQuantity(item.id, item.count - 1)}
                                        >-</button>
                                        <span className="cart-count">{item.count}</span>
                                        <button
                                            className={`quantity-btn${darkMode ? ' dark-mode' : ''}`}
                                            onClick={() => updateQuantity(item.id, item.count + 1)}
                                        >+</button>
                                    </div>
                                    <span className="cart-col cart-price">
                                        {reduction ? (
                                            <>
                                                <span className="old-price" style={{ marginRight: 6 }}>
                                                    <del>{(priceOriginal * item.count).toFixed(2)}€</del>
                                                </span>
                                                <span className="new-price">
                                                    {(priceFinal * item.count).toFixed(2)}€
                                                </span>
                                                <span className="discount-badge" style={{ marginLeft: 4 }}>
                                                    -{reduction}%
                                                </span>
                                            </>
                                        ) : (
                                            <span className="new-price">
                                                {(priceFinal * item.count).toFixed(2)}€
                                            </span>
                                        )}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>

                    <p>Total : {total.toFixed(2)}€</p>
                    <button
                        className={`button${darkMode ? ' dark-mode' : ''}`}
                        onClick={handleValidateOrder}
                    >
                        Valider ma commande
                    </button>
                </>
            )}
        </div>
    );
}

export default Cart;
