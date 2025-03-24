import React from 'react';

function Cart({ cartItems = [], setCartItems }){
    const updateQuantity = (itemName, newCount) => {
        setCartItems(prev => {
            const updated = { ...prev };
            if (newCount > 0) {
                updated[itemName].count = newCount;
            } else {
                delete updated[itemName];
            }
            return updated;
        });
    };

    const total = Object.values(cartItems).reduce((sum, item) => sum + item.price * item.count, 0);

    return (
        <div className="Cart">
            <div className="cart">
                <h1>Panier</h1>
                <ul>
                    {Object.values(cartItems).map((item) => (
                        <li key={item.name}>
                            <span>{item.name}</span>
                            <div className="quantity-controls">
                                <button
                                    className="quantity-btn"
                                    onClick={() => updateQuantity(item.name, item.count - 1)}
                                >
                                    -
                                </button>
                                <span>{item.count}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => updateQuantity(item.name, item.count + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <span>{(item.price * item.count).toFixed(2)}€</span>
                        </li>
                    ))}
                </ul>
                <p>Total : {total.toFixed(2)}€</p>
                <button className="button" onClick={() => setCartItems({})}>Vider le panier</button>
            </div>
        </div>
    )
}

export default Cart;
