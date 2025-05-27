import React, { useEffect, useState, useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/services.css";

function Dashboard() {
    const { darkMode } = useContext(PreferencesContext);
    const [reservations, setReservations] = useState([]);
    const [litiges, setLitiges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:3001/reservations", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setReservations(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors du chargement des réservations.");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:3001/litiges", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setLitiges(data))
            .catch(() => setLitiges([]));
    }, []);

    const handleCancel = (id) => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:3001/reservations/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ statut: "annulée" })
        })
            .then(res => res.json())
            .then(() => {
                setReservations(prev =>
                    prev.map(r =>
                        r.id === id ? { ...r, statut: "annulée" } : r
                    )
                );
            });
    };

    const handleResolu = (id) => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:3001/litiges/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ statut: "résolu" })
        })
            .then(res => res.json())
            .then(() => {
                setLitiges(prev =>
                    prev.map(l =>
                        l.id === id ? { ...l, statut: "résolu" } : l
                    )
                );
            });
    };

    const upcoming = reservations.filter(r => r.statut === "à venir");
    const past = reservations.filter(r => r.statut === "effectuée" || r.statut === "annulée");

    const sortedUpcoming = [...upcoming].sort(
        (a, b) => new Date(a.date_reservation) - new Date(b.date_reservation)
    );
    const sortedPast = [...past].sort(
        (a, b) => new Date(b.date_reservation) - new Date(a.date_reservation)
    );
    const sortedLitiges = [...litiges].sort(
        (a, b) => new Date(b.date_creation) - new Date(a.date_creation)
    );

    return (
        <div className={`dashboard-block ${darkMode ? "dark-mode" : ""}`}>
            <h2>Mon tableau de bord</h2>
            {loading ? (
                <p>Chargement...</p>
            ) : error ? (
                <p className="agenda-message error">{error}</p>
            ) : (
                <>
                    <section>
                        <h3>Rendez-vous à venir</h3>
                        {upcoming.length === 0 ? (
                            <p>Aucun rendez-vous à venir.</p>
                        ) : (
                            <ul className="dashboard-list">
                                {sortedUpcoming.map(r => (
                                    <li key={r.id}>
                                        <strong>{new Date(r.date_reservation).toLocaleString()}</strong>
                                        {" — "}
                                        {r.prestation_titre}
                                        {" — "}
                                        <span className="dashboard-status">{r.statut}</span>
                                        {r.commentaire && (
                                            <span className="dashboard-comment"> — {r.commentaire}</span>
                                        )}
                                        {r.statut === "à venir" && (
                                            <button
                                                className="dashboard-cancel-btn"
                                                onClick={() => handleCancel(r.id)}
                                            >
                                                Annuler
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                    <section>
                        <h3>Historique des prestations</h3>
                        {past.length === 0 ? (
                            <p>Aucune prestation passée ou annulée.</p>
                        ) : (
                            <ul className="dashboard-list">
                                {sortedPast.map(r => (
                                    <li key={r.id}>
                                        <strong>{new Date(r.date_reservation).toLocaleString()}</strong>
                                        {" — "}
                                        {r.prestation_titre}
                                        {" — "}
                                        <span className={`dashboard-status ${r.statut}`}>{r.statut}</span>
                                        {r.commentaire && (
                                            <span className="dashboard-comment"> — {r.commentaire}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                    <section>
                        <h3>Litiges</h3>
                        {sortedLitiges.length === 0 ? (
                            <p>Aucun litige en cours ou passé.</p>
                        ) : (
                            <ul className="dashboard-list">
                                {sortedLitiges.map(l => (
                                    <li key={l.id}>
                                        <strong>{new Date(l.date_creation).toLocaleString()}</strong>
                                        {" — "}
                                        {l.sujet}
                                        {" — "}
                                        <span className={`dashboard-status ${l.statut}`}>{l.statut}</span>
                                        {l.description && (
                                            <span className="dashboard-comment"> — {l.description}</span>
                                        )}
                                        {l.fichier && (
                                            <a
                                                href={`http://localhost:3001/images/${l.fichier}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ marginLeft: 8, color: '#1eb1d4' }}
                                            >
                                                PJ
                                            </a>
                                        )}
                                        {l.statut !== "résolu" && l.statut !== "fermé" && (
                                            <button
                                                className="dashboard-cancel-btn"
                                                onClick={() => handleResolu(l.id)}
                                            >
                                                Marquer comme résolu
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

export default Dashboard;
