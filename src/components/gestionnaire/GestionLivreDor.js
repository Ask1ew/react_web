import React, { useState, useEffect } from "react";
import "../../styles/gestionnaire.css";

function GestionLivreDor() {
    const [temoignages, setTemoignages] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedTemoignage, setSelectedTemoignage] = useState(null);
    const [reponse, setReponse] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch('http://localhost:3001/livredor/all', {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setTemoignages(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur chargement témoignages:", err));

        fetch('http://localhost:3001/livredor/stats', {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Erreur chargement stats:", err));
    }, []);

    const handleStatutChange = (id, statut) => {
        fetch(`http://localhost:3001/livredor/${id}/statut`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ statut })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessage("Statut mis à jour !");
                    fetchTemoignages();
                }
            })
            .catch(err => setError(err.message || "Erreur lors de la modération"));
    };

    const handleReponseSubmit = (id) => {
        fetch(`http://localhost:3001/livredor/${id}/reponse`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ reponse })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessage("Réponse envoyée !");
                    setReponse("");
                    setSelectedTemoignage(null);
                    fetchTemoignages();
                }
            })
            .catch(err => setError(err.message || "Erreur lors de l’envoi de la réponse"));
    };

    const fetchTemoignages = () => {
        fetch('http://localhost:3001/livredor/all', {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setTemoignages(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur chargement témoignages:", err));
    };

    return (
        <div className="gestion-livredor">
            <main className="gestion-livredor-main">
                <h2>Gestion du Livre d'Or</h2>
                {message && <p className="livredor-success-message">{message}</p>}
                {error && <p className="livredor-error-message">{error}</p>}

                <div className="livredor-stats">
                    <h3>Taux de satisfaction</h3>
                    {Object.entries(stats).map(([q, s]) => (
                        <div key={q} className="livredor-stat-item">
                            <p>{q === "q1" ? "Le site est-il facile à utiliser ?" : "Recommanderiez-vous ce site à un ami ?"}</p>
                            <div className="livredor-graph">
                                <div className="livredor-bar-oui" style={{ width: `${(s.oui / (s.oui + s.non) * 100) || 0}%` }}>
                                    {s.oui} Oui
                                </div>
                                <div className="livredor-bar-non" style={{ width: `${(s.non / (s.oui + s.non) * 100) || 0}%` }}>
                                    {s.non} Non
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <h3>Témoignages à modérer</h3>
                {temoignages.length === 0 ? (
                    <p className="livredor-no-result">Aucun témoignage à modérer.</p>
                ) : (
                    <ul className="livredor-temoignages-list">
                        {temoignages.map(t => (
                            <li key={t.id} className="livredor-temoignage">
                                <strong>{t.nom}</strong> - {new Date(t.date_creation).toLocaleDateString()}
                                <p>{t.message}</p>
                                {(() => {
                                    try {
                                        const reponses = typeof t.reponses === 'string' ? JSON.parse(t.reponses) : t.reponses;
                                        if (!reponses || typeof reponses !== 'object') return null;
                                        return Object.entries(reponses).map(([q, a]) => (
                                            <li key={q}>
                                                {q === "q1" ? "Le site est-il facile à utiliser ?" : "Recommanderiez-vous ce site à un ami ?"} : <strong>{a}</strong>
                                            </li>
                                        ));
                                    } catch (e) {
                                        console.error("Erreur parsing reponses:", e);
                                        return null;
                                    }
                                })()}

                                <div className="livredor-actions">
                                    <button
                                        onClick={() => handleStatutChange(t.id, "approuvé")}
                                        disabled={t.statut === "approuvé"}
                                        className="livredor-btn"
                                    >
                                        Approuver
                                    </button>
                                    <button
                                        onClick={() => handleStatutChange(t.id, "rejeté")}
                                        disabled={t.statut === "rejeté"}
                                        className="livredor-btn"
                                    >
                                        Rejeter
                                    </button>
                                    <button
                                        onClick={() => setSelectedTemoignage(t)}
                                        className="livredor-btn"
                                    >
                                        Répondre
                                    </button>
                                </div>
                                {t.reponse && (
                                    <div className="livredor-reponse">
                                        <strong>Réponse de l’équipe :</strong> {t.reponse}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {selectedTemoignage && (
                    <div className="livredor-reponse-form">
                        <h4>Répondre à {selectedTemoignage.nom}</h4>
                        <textarea
                            value={reponse}
                            onChange={(e) => setReponse(e.target.value)}
                            placeholder="Votre réponse..."
                            rows={4}
                        />
                        <button
                            onClick={() => handleReponseSubmit(selectedTemoignage.id)}
                            className="livredor-btn"
                        >
                            Envoyer la réponse
                        </button>
                        <button
                            onClick={() => setSelectedTemoignage(null)}
                            className="livredor-btn"
                        >
                            Annuler
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default GestionLivreDor;
