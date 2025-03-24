import React, { useState } from 'react';

function Cart(){
    const [cartItems, setCartItems] = useState([]);

    function resetCart() {
        setCartItems([]);
    }

    let total = 0;
    cartItems.forEach(article => {
        total += article.price;
    });

    return (
        <div className="Cart">
            <div className="cart">
                <h1>Panier</h1>
                <ul>
                    {cartItems.map((article, index) => (
                        <li key={article.id}>{article.name} : {article.price}€</li>
                    ))}
                </ul>
                <p>
                    Total : {total.toFixed(2)}€
                </p>
                <button className="button" onClick={resetCart}>Vider le panier</button>
            </div>
        </div>
    )
}

export default Cart;
