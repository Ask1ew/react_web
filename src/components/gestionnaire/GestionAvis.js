import React, { useEffect, useState } from "react";
import "../../styles/gestionnaire.css";

function GestionAvis() {
    const [avis, setAvis] = useState([]);
    const [editing, setEditing] = useState(null);
    const [reponse, setReponse] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [produits, setProduits] = useState([]);
    const [prestations, setPrestations] = useState([]);

    // Récupérer tous les avis
    const fetchAvis = () => {
        fetch("http://localhost:3001/avis", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setAvis(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Erreur fetch avis :", err);
                setError("Erreur lors du chargement des avis");
            });
    };

    // Récupérer utilisateurs, produits, prestations (pour afficher les noms)
    useEffect(() => {
        fetchAvis();
        fetch("http://localhost:3001/utilisateur", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setUtilisateurs(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur fetch utilisateurs :", err));
        fetch("http://localhost:3001/produits", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setProduits(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur fetch produits :", err));
        fetch("http://localhost:3001/prestations", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setPrestations(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur fetch prestations :", err));
    }, []);

    // Trouver le nom d'un utilisateur, produit ou prestation
    const getUtilisateur = (userId) => utilisateurs.find(u => u.id === userId) || {};
    const getProduit = (productId) => produits.find(p => p.id === productId) || {};
    const getPrestation = (prestationId) => prestations.find(p => p.id === prestationId) || {};

    // Modérer un avis (approuver/rejeter)
    const handleModeration = (id, action) => {
        fetch(`http://localhost:3001/avis/${id}/moderation`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ action })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage(`Avis ${action === "approuver" ? "approuvé" : "rejeté"} !`);
                fetchAvis();
            })
            .catch(err => setError(err.message || "Erreur lors de la modération"));
    };

    // Répondre à un avis
    const handleReponse = (id) => {
        setError("");
        setMessage("");
        fetch(`http://localhost:3001/avis/${id}/reponse`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ reponse })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage("Réponse envoyée !");
                setReponse("");
                setEditing(null);
                fetchAvis();
            })
            .catch(err => setError(err.message || "Erreur lors de l'envoi de la réponse"));
    };

    return (
        <div className="gestion-avis">
            <h2>Modération et réponse aux avis</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Liste des avis */}
            <ul className="avis-list">
                {avis.map(a => (
                    <li key={a.id} className="avis-item">
                        <div className="avis-header">
                            <span className="avis-note">{"★".repeat(a.note)}{"☆".repeat(5 - a.note)}</span>
                            <span className="avis-date">{a.date_creation ? new Date(a.date_creation).toLocaleDateString() : ""}</span>
                            <span className="avis-user">{getUtilisateur(a.user_id)?.nom || "Anonyme"}</span>
                            {a.product_id && <span className="avis-concerne">Produit : {getProduit(a.product_id)?.name || a.product_id}</span>}
                            {a.prestation_id && <span className="avis-concerne">Prestation : {getPrestation(a.prestation_id)?.titre || a.prestation_id}</span>}
                        </div>
                        <div className="avis-comment">{a.commentaire}</div>
                        <div className="avis-statut">
                            <strong>Statut :</strong> {a.statut || "nouveau"}
                        </div>
                        {/* Réponse à l'avis (si existante) */}
                        {a.reponse && (
                            <div className="avis-reponse">
                                <strong>Réponse gestionnaire :</strong> {a.reponse}
                            </div>
                        )}
                        <div className="avis-actions">
                            {/* Afficher "Approuver" et "Rejeter" uniquement si l'avis n'est pas déjà approuvé */}
                            {a.statut !== "approuvé" && (
                                <>
                                    <button onClick={() => handleModeration(a.id, "approuver")}>Approuver</button>
                                    <button onClick={() => handleModeration(a.id, "rejeter")}>Rejeter</button>
                                </>
                            )}
                            <button onClick={() => setEditing(a.id)}>Répondre</button>
                        </div>
                        {editing === a.id && (
                            <div className="avis-reponse-form">
                                <textarea
                                    value={reponse}
                                    onChange={e => setReponse(e.target.value)}
                                    placeholder="Votre réponse..."
                                    rows={4}
                                    required
                                />
                                <div className="avis-reponse-buttons">
                                    <button onClick={() => handleReponse(a.id)}>Envoyer la réponse</button>
                                    <button onClick={() => setEditing(null)}>Annuler</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GestionAvis;
