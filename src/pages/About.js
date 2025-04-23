import React, { useContext } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/about.css';

function About() {
    const { darkMode } = useContext(PreferencesContext);

    return (
        <div className={`about-root ${darkMode ? 'dark-mode' : ''}`}>
            <Header />
            <div className="main-content about-page">
                <h1>À propos de Galactic Burgers</h1>
                <p>
                    Bienvenue chez Galactic Burgers, votre destination pour des burgers interstellaires
                    qui raviront vos papilles ! Nous sommes passionnés par l'idée de combiner des saveurs
                    uniques et des ingrédients de qualité pour vous offrir une expérience culinaire hors du commun.
                </p>
                <h2>Notre histoire</h2>
                <p>
                    Fondée en 2023, Galactic Burgers est née de l'amour pour la gastronomie et l'exploration.
                    Nous avons commencé avec une simple idée : créer des burgers qui transportent nos clients
                    dans une aventure gustative à travers la galaxie. Aujourd'hui, nous sommes fiers de servir
                    des milliers de clients heureux.
                </p>
                <h2>Nos valeurs</h2>
                <ul>
                    <li><strong>Qualité :</strong> Nous utilisons uniquement des ingrédients frais et locaux.</li>
                    <li><strong>Innovation :</strong> Nos recettes sont conçues pour surprendre et ravir.</li>
                    <li><strong>Satisfaction client :</strong> Votre bonheur est notre priorité absolue.</li>
                </ul>
                <h2>Rejoignez-nous</h2>
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

export default About;
