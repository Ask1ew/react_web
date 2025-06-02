import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/fidelity.css";

function FidelityProgress() {
    const { darkMode } = useContext(PreferencesContext);
    const [points, setPoints] = useState(0);
    const [rewards, setRewards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return; // Protection si non connecté

        fetch("http://localhost:3001/fidelite", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Non autorisé");
                return res.json();
            })
            .then(data => setPoints(data.points || 0))
            .catch(() => setPoints(0));

        fetch("http://localhost:3001/recompenses", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Non autorisé");
                return res.json();
            })
            .then(data => setRewards(Array.isArray(data) ? data : []))
            .catch(() => setRewards([]));
    }, []);


    // Calcul du pourcentage de progression
    const maxPoints = rewards.length > 0 ? Math.max(...rewards.map(r => r.cout)) : 100;
    const progress = Math.min(100, (points / maxPoints) * 100);

    return (
        <div className={`fidelity-progress ${darkMode ? "dark-mode" : ""}`}>
            <h2>Vos points de fidélités</h2>
            <div className="fidelity-bar-container">
                <div className="fidelity-bar" style={{ width: `${progress}%` }}></div>
                {rewards.map(r => (
                    <div
                        key={r.id}
                        className="fidelity-milestone"
                        style={{ left: `${(r.cout / maxPoints) * 100}%` }}
                        title={`${r.titre} - ${r.cout} points`}
                    ></div>
                ))}
            </div>
            <div className="fidelity-milestone-labels">
                {rewards.map(r => (
                    <span
                        key={r.id}
                        className="fidelity-milestone-label"
                        style={{ left: `${(r.cout / maxPoints) * 100}%` }}
                    >
                        {r.titre}
                    </span>
                ))}
            </div><br/>
            <p className="fidelity-points">Points : {points}</p>
            <button
                className="fidelity-btn"
                onClick={() => navigate("/fidelity")}
            >
                Échanger mes points
            </button>
        </div>
    );
}

export default FidelityProgress;
