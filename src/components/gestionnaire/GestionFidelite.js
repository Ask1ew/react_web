import React, { useEffect, useState } from "react";
import "../../styles/gestionnaire.css";

function GestionFidelite() {
    const [fidelites, setFidelites] = useState([]);
    const [editing, setEditing] = useState(null);
    const [points, setPoints] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchFidelites = () => {
        fetch("http://localhost:3001/fidelite/all", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setFidelites(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Erreur fetch fidelites :", err);
                setError("Erreur lors du chargement des points de fidélité");
            });
    };

    useEffect(() => {
        fetchFidelites();
    }, []);

    const handleEdit = (fidelite) => {
        setEditing(fidelite.id);
        setPoints(fidelite.points);
        setMessage("");
        setError("");
    };

    const handleCancel = () => {
        setEditing(null);
        setPoints("");
        setMessage("");
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        fetch(`http://localhost:3001/fidelite/${editing}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ points: Number(points) })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage("Points de fidélité mis à jour !");
                setEditing(null);
                setPoints("");
                fetchFidelites();
            })
            .catch(err => {
                setError(err.message || "Erreur lors de la mise à jour des points");
            });
    };

    // Récupérer les noms des utilisateurs (optionnel, si tu veux afficher nom/prénom)
    const [utilisateurs, setUtilisateurs] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3001/utilisateur", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setUtilisateurs(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur fetch utilisateurs :", err));
    }, []);

    // Associer chaque fidelite à son utilisateur
    const getUtilisateur = (userId) => {
        return utilisateurs.find(u => u.id === userId) || {};
    };

    return (
        <div className="gestion-fidelite">
            <div className="gestion-fidelite-main">
                <h2>Gestion des points de fidélité</h2>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                {/* Formulaire de modification */}
                {editing && (
                    <form className="fidelite-form" onSubmit={handleSubmit}>
                        <label>Nouveau nombre de points :</label>
                        <input
                            type="number"
                            value={points}
                            onChange={e => setPoints(e.target.value)}
                            min="0"
                            required
                        />
                        <button type="submit">Valider</button>
                        <button type="button" onClick={handleCancel}>Annuler</button>
                    </form>
                )}

                {/* Tableau des points de fidélité */}
                <table>
                    <thead>
                    <tr>
                        <th>ID utilisateur</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Points</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fidelites.map(fidelite => {
                        const user = getUtilisateur(fidelite.user_id);
                        return (
                            <tr key={fidelite.id}>
                                <td>{fidelite.user_id}</td>
                                <td>{user.nom || "-"}</td>
                                <td>{user.prenom || "-"}</td>
                                <td>{user.email || "-"}</td>
                                <td>{fidelite.points}</td>
                                <td>
                                    <button onClick={() => handleEdit(fidelite)}>Modifier</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GestionFidelite;
