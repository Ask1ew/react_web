import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/products.css';

function Cart() {
    const { cartItems, updateQuantity } = useContext(CartContext);
    const { darkMode } = useContext(PreferencesContext);
    const navigate = useNavigate();
    const total = Object.values(cartItems).reduce((sum, item) => sum + item.price * item.count, 0);

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
                        {Object.values(cartItems).map((item) => (
                            <li key={item.id}>
                                <span>{item.name}</span>
                                <div className="quantity-controls">
                                    <button
                                        className={`quantity-btn${darkMode ? ' dark-mode' : ''}`}
                                        onClick={() => updateQuantity(item.id, item.count - 1)}
                                    >-</button>
                                    <span>{item.count}</span>
                                    <button
                                        className={`quantity-btn${darkMode ? ' dark-mode' : ''}`}
                                        onClick={() => updateQuantity(item.id, item.count + 1)}
                                    >+</button>
                                </div>
                                <span>{(item.price * item.count).toFixed(2)}€</span>
                            </li>
                        ))}
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
