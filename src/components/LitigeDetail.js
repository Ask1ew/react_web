import React, { useEffect, useState, useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/litiges.css";

function LitigeDetail() {
    const { darkMode } = useContext(PreferencesContext);
    const [litiges, setLitiges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:3001/litiges", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setLitiges(data);
                setLoading(false);
            })
            .catch(() => {
                setLitiges([]);
                setLoading(false);
            });
    }, []);

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

    // Tri du plus récent au plus ancien
    const sortedLitiges = [...litiges].sort(
        (a, b) => new Date(b.date_creation) - new Date(a.date_creation)
    );

    return (
        <div className={`litiges-container${darkMode ? " dark-mode" : ""}`}>
            <h3>Suivi des litiges</h3>
            {loading ? (
                <p>Chargement...</p>
            ) : sortedLitiges.length === 0 ? (
                <p>Aucun litige en cours ou passé.</p>
            ) : (
                <div className="litiges-table-wrapper">
                    <table className="litiges-table">
                        <thead>
                        <tr>
                            <th># Litige</th>
                            <th># Commande</th>
                            <th>Type</th>
                            <th>Date de soumission</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedLitiges.map(l => (
                            <tr key={l.id}>
                                <td>{l.id}</td>
                                <td>{l.commande_id || "-"}</td>
                                <td>{l.type || l.sujet || "-"}</td>
                                <td>{new Date(l.date_creation).toLocaleString()}</td>
                                <td>
                                    <span className={`litiges-status ${l.statut.replace(/\s/g, "-")}`}>{l.statut}</span>
                                </td>
                                <td>
                                    {l.statut !== "résolu" && l.statut !== "fermé" && (
                                        <button
                                            className="litiges-cancel-btn"
                                            onClick={() => handleResolu(l.id)}
                                        >
                                            Marquer comme résolu
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default LitigeDetail;
