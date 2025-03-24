import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import ShoppingList from "../components/ShoppingList";

function Home() {
    const [cartItems, setCartItems] = useState({});

    const addToCart = (item) => {
        setCartItems((prevItems) => ({
            ...prevItems,
            [item.name]: {
                ...item,
                count: prevItems[item.name]?.count ? prevItems[item.name].count + 1 : 1
            }
        }));
    };

    return (
        <div>
            <Header />
            <div className="main-content">
                <div className="container">
                    <div className="content">
                        <ShoppingList addToCart={addToCart} />
                    </div>
                </div>
                <Cart cartItems={cartItems} setCartItems={setCartItems} />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
