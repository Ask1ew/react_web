import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/index.css';
import React from "react";

function Preferences() {
    return (
        <div>
            <Header />
            <div className="main-content about-page">
                <h1>Préférences utilisateurs</h1>
                <h2>Thème</h2>
                <ul>
                    <li><strong>Sombre :</strong> </li>
                    <li><strong>Clair :</strong> </li>
                    <li><strong>Gris :</strong> </li>
                </ul>
                <h2>Langage</h2>
                <ul>
                    <li><strong>Français :</strong> </li>
                    <li><strong>Anglais :</strong> </li>
                </ul>
                <h2>Autres 2</h2>
                <p>
                    Que vous soyez un amateur de burgers classiques ou un aventurier culinaire à la recherche
                    de nouvelles saveurs, Galactic Burgers a quelque chose pour vous. Venez nous rendre visite
                    et découvrez pourquoi nos burgers sont les meilleurs de la galaxie !
                </p>
            </div>
            <Footer />
        </div>
    );
}

export default Preferences;
