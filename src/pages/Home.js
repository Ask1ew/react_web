import React, { useContext } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import '../styles/index.css';

function Home() {
    const { darkMode } = useContext(PreferencesContext);

    return (
        <div className={`home-root ${darkMode ? 'dark-mode' : ''}`}>
            <Header />
            <main className="home-main">
                {/* Bloc d'accroche */}
                <section className="home-hero">
                    <img
                        src="http://localhost:3001/images/galactic_burgers_logo.png"
                        alt="Logo Galactic Burgers"
                        className="home-hero-logo"
                    />
                    <h1 className="home-title">Galactic Burgers</h1>
                    <p className="home-slogan">
                        Des burgers cosmiques, un goût venu d'ailleurs&nbsp;!
                    </p>
                </section>

                {/* Bloc présentation */}
                <section className="home-section">
                    <div className="home-section-content">
                        <h2>Notre mission</h2>
                        <p>
                            Chez Galactic Burgers, nous avons une ambition simple&nbsp;: révolutionner le burger en alliant créativité, qualité et convivialité. Nos recettes uniques sont élaborées à partir d’ingrédients frais, locaux et savoureux, pour une expérience gustative inoubliable.
                        </p>
                    </div>
                    <img
                        src="http://localhost:3001/images/space_burger1.jpg"
                        alt="Burger signature"
                        className="home-section-image"
                    />
                </section>

                {/* Bloc valeurs */}
                <section className="home-section reverse">
                    <div className="home-section-content">
                        <h2>Nos valeurs</h2>
                        <ul>
                            <li><strong>Qualité :</strong> Viandes sélectionnées, pains artisanaux, légumes de saison.</li>
                            <li><strong>Originalité :</strong> Des recettes exclusives et des sauces maison.</li>
                            <li><strong>Accueil :</strong> Un service chaleureux et une ambiance conviviale.</li>
                            <li><strong>Écoresponsabilité :</strong> Engagement pour le local et la réduction des déchets.</li>
                        </ul>
                    </div>
                    <img
                        src="http://localhost:3001/images/space_burger2.jpg"
                        alt="Valeurs Galactic Burgers"
                        className="home-section-image"
                    />
                </section>

                {/* Bloc services */}
                <section className="home-section">
                    <div className="home-section-content">
                        <h2>Nos services</h2>
                        <ul>
                            <li>Vente sur place et à emporter</li>
                            <li>Livraison à domicile</li>
                            <li>Food truck pour événements privés et professionnels</li>
                            <li>Ateliers et animations culinaires</li>
                        </ul>
                    </div>
                    <img
                        src="http://localhost:3001/images/space_burger3.jpg"
                        alt="Food truck Galactic Burgers"
                        className="home-section-image"
                    />
                </section>

                {/* Bloc appel à l'action */}
                <section className="home-cta">
                    <h2>Prêt pour une aventure culinaire&nbsp;?</h2>
                    <p>
                        Venez découvrir nos burgers galactiques dans une ambiance unique, ou commandez en ligne pour un voyage gustatif à domicile&nbsp;!
                    </p>
                    <a href="/contact" className="home-cta-btn">Nous contacter</a>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
