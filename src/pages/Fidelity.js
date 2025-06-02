import React, { useEffect, useState, useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/fidelity.css";

function Fidelity() {
    const { darkMode } = useContext(PreferencesContext);
    const [points, setPoints] = useState(0);
    const [rewards, setRewards] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        // Récupère les points de fidélité de l'utilisateur
        fetch("http://localhost:3001/fidelite", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPoints(data.points || 0));

        // Récupère la liste des récompenses
        fetch("http://localhost:3001/recompenses", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setRewards(data));
    }, []);

    const handleExchange = (rewardId, cost) => {
        if (points < cost) {
            setMessage("Vous n'avez pas assez de points pour cette récompense.");
            return;
        }
        const token = localStorage.getItem("token");
        fetch(`http://localhost:3001/fidelite/echange`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ rewardId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPoints(points - cost);
                    setMessage("Récompense échangée avec succès !");
                } else {
                    setMessage(data.error || "Erreur lors de l'échange.");
                }
            })
            .catch(() => setMessage("Erreur réseau."));
    };

    return (
        <div className={`fidelite-root${darkMode ? " dark-mode" : ""}`}>
            <Header />
            <div className="fidelite-main">
                <h1 className="fidelite-title">Programme de Fidélité</h1>
                <div className="fidelite-points">
                    <span>Mes points de fidélité :</span>
                    <span className="fidelite-score">{points}</span>
                </div>
                <h2 className="fidelite-subtitle">Récompenses disponibles</h2>
                <div className="fidelite-rewards-list">
                    {rewards.length === 0 ? (
                        <p>Aucune récompense disponible pour le moment.</p>
                    ) : (
                        rewards.map(r => (
                            <div className="fidelite-reward" key={r.id}>
                                <div className="fidelite-reward-info">
                                    <span className="fidelite-reward-title">{r.titre}</span>
                                    <span className="fidelite-reward-desc">{r.description}</span>
                                    <span className="fidelite-reward-cost">{r.cout} points</span>
                                </div>
                                <button
                                    className="fidelite-btn"
                                    disabled={points < r.cout}
                                    onClick={() => handleExchange(r.id, r.cout)}
                                >
                                    Échanger
                                </button>
                            </div>
                        ))
                    )}
                </div>
                {message && <div className="fidelite-message">{message}</div>}
            </div>
            <Footer />
        </div>
    );
}

export default Fidelity;
