import React, { useContext } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import ShoppingList from "../components/ShoppingList";
import { PreferencesContext } from "../context/PreferencesContext";

function Products() {
    const { darkMode } = useContext(PreferencesContext);

    return (
        <div className={darkMode ? "dark-mode" : "light-mode"}>
            <Header />
            <div className="main-content">
                <div className="container">
                    <div className="content">
                        <ShoppingList />
                    </div>
                </div>
                <Cart />
            </div>
            <Footer />
        </div>
    );
}

export default Products;
