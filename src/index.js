import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/index.css';
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Error from "./pages/Error";
import Detail from "./pages/Detail";
import Preferences from "./pages/Preferences";
import Connexion from "./pages/Connexion";
import {PreferencesProvider} from "./context/PreferencesContext";
import {CartProvider} from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <PreferencesProvider>
            <CartProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/preferences" element={<Preferences />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/detail" element={<Detail />} />
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Router>
            </CartProvider>
        </PreferencesProvider>
    </React.StrictMode>
);
