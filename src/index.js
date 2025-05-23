import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/index.css';
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Error from "./pages/Error";
import Detail from "./pages/Detail";
import Preferences from "./pages/Preferences";
import Login from "./pages/Login";
import { PreferencesProvider } from "./context/PreferencesContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext"; // <-- Ajout
import Profile from "./pages/Profile";
import {DeviseProvider} from "./context/DeviseContext";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Dashboard from "./components/Dashboard";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DeviseProvider>
            <LanguageProvider>
                <PreferencesProvider>
                    <CartProvider>
                        <Router>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/preferences" element={<Preferences />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/detail" element={<Detail />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/payment" element={<Payment />}/>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="*" element={<Error />} />
                            </Routes>
                        </Router>
                    </CartProvider>
                </PreferencesProvider>
            </LanguageProvider>
        </DeviseProvider>
    </React.StrictMode>
);
