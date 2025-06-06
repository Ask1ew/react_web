import React, { useEffect, useState, useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FidelityExchangeModal from "../components/FidelityExchangeModal";
import "../styles/fidelity.css";
import Breadcrumb from "../components/Breadcrumb";

function Fidelity() {
    const { darkMode } = useContext(PreferencesContext);
    const [points, setPoints] = useState(0);
    const [rewards, setRewards] = useState([]);
    const [message, setMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [pendingRewardId, setPendingRewardId] = useState(null);
    const [pendingCost, setPendingCost] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:3001/fidelite", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPoints(data.points || 0));

        fetch("http://localhost:3001/recompenses", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setRewards(data));
    }, []);

    const handleExchange = (rewardId, cost, type) => {
        if (points < cost) {
            setMessage("Vous n'avez pas assez de points pour cette récompense.");
            return;
        } else if (type === "burger" || type === "boisson") {
            setPendingRewardId(rewardId);
            setPendingCost(cost);
            setModalType(type);
            setModalOpen(true);
        }
    };


    // Appelé après sélection dans le modal (choix burger/boisson)
    const handleModalExchange = () => {
        if (pendingRewardId && pendingCost) {
            doExchange(pendingRewardId, pendingCost);
        }
        setModalOpen(false);
        setPendingRewardId(null);
        setPendingCost(0);
    };

    // Effectue la requête d'échange (consomme les points)
    const doExchange = (rewardId, cost) => {
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
                <Breadcrumb items={[
                    { label: "Produits", to: "/products" },
                    { label: "Détails" }
                ]} />
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
                                    onClick={() => handleExchange(r.id, r.cout, r.type)}
                                >
                                    Échanger
                                </button>
                            </div>
                        ))
                    )}
                </div>
                {message && <div className="fidelite-message">{message}</div>}
            </div>
            <FidelityExchangeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                type={modalType}
                onExchange={handleModalExchange}
            />
            <Footer />
        </div>
    );
}

export default Fidelity;
