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
import Litiges from "./pages/Litiges";
import Confirmation from "./pages/Confirmation";
import Fidelity from "./pages/Fidelity";
import Feedbacks from "./pages/Feedbacks";
import Gestionnaire from "./pages/Gestionnaire";
import Promotion from "./pages/Promotion";
import LivreDor from "./pages/LivreDor";

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
                                <Route path="/litiges" element={<Litiges/>}/>
                                <Route path="/confirmation" element={<Confirmation/>}/>
                                <Route path="/fidelity" element={<Fidelity/>}/>
                                <Route path="/feedbacks" element={<Feedbacks />} />
                                <Route path="/gestionnaire" element={<Gestionnaire />} />
                                <Route path="/promotion" element={<Promotion />} />
                                <Route path="/livredor" element={<LivreDor />} />
                                <Route path="*" element={<Error />} />
                            </Routes>
                        </Router>
                    </CartProvider>
                </PreferencesProvider>
            </LanguageProvider>
        </DeviseProvider>
    </React.StrictMode>
);
