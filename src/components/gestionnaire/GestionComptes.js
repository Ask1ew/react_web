import React, { useEffect, useState, useContext } from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import "../../styles/gestionnaire.css";

function GestionComptes() {
    const { darkMode } = useContext(PreferencesContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchUsers = () => {
        setLoading(true);
        setError("");
        fetch("http://localhost:3001/utilisateur", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs.");
                return res.json();
            })
            .then(data => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || "Erreur réseau.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (userId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
        setError("");
        setMessage("");
        fetch(`http://localhost:3001/utilisateur/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la suppression.");
                setMessage("Utilisateur supprimé avec succès.");
                fetchUsers();
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    const handleToggleAdmin = (user) => {
        const newStatus = user.statut === "gestionnaire" ? "utilisateur" : "gestionnaire";
        setError("");
        setMessage("");
        fetch(`http://localhost:3001/utilisateur/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ statut: newStatus })
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la mise à jour du statut.");
                setMessage(`Statut de ${user.nom} ${user.prenom} mis à jour.`);
                fetchUsers();
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    return (
        <div className={`gestion-comptes${darkMode ? " dark-mode" : ""}`}>
            <h2>Gestion des comptes</h2>
            {loading && <p>Chargement des utilisateurs...</p>}
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <table>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.email}</td>
                        <td>{user.statut || "utilisateur"}</td>
                        <td>
                            <button onClick={() => handleToggleAdmin(user)}>
                                {user.statut === "gestionnaire" ? "Retirer gestionnaire" : "Rendre gestionnaire"}
                            </button>
                            <button onClick={() => handleDelete(user.id)} style={{ marginLeft: "8px", color: "red" }}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default GestionComptes;
