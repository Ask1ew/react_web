import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/error.css';

function Connexion() {
    return (
        <div>
            <Header />
            <div className="error-page">
                <h1>Erreur 404</h1>
                <p>La page que vous cherchez n'existe pas.</p>
                <p>Vous pouvez retourner à l'<a href="/">accueil</a> ou essayer une autre page.</p>
            </div>
            <Footer />
        </div>
    );
}

export default Connexion;
