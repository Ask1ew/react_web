import React from 'react';

function Cart({ cartItems = [], setCartItems }){
    function resetCart() {
        setCartItems([]);
    }

    const groupedItems = cartItems.reduce((acc, article) => {
        if (acc[article.name]) {
            acc[article.name].count += 1;
        } else {
            acc[article.name] = { ...article, count: 1 };
        }
        return acc;
    }, {});

    let total = 0;
    Object.values(groupedItems).forEach(article => {
        total += article.price * article.count;
    });

    return (
        <div className="Cart">
            <div className="cart">
                <h1>Panier</h1>
                <ul>
                    {Object.values(groupedItems).map((article, index) => (
                        <li key={index}>
                            {article.name} (x{article.count}) : {(article.price * article.count).toFixed(2)}€
                        </li>
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
