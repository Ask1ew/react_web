import React, { useEffect, useState } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/feedbacks.css";

function ProfileAvis() {
    const [avis, setAvis] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editNote, setEditNote] = useState(0);
    const [editComment, setEditComment] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { darkMode } = React.useContext(PreferencesContext);

    // Charger les avis de l'utilisateur
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch("http://localhost:3001/avis/user", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAvis(Array.isArray(data) ? data : []));
    }, []);

    // Lancer le mode édition
    const handleEdit = (a) => {
        setEditId(a.id);
        setEditNote(a.note);
        setEditComment(a.commentaire);
        setMessage('');
        setError('');
    };

    // Annuler l’édition
    const handleCancelEdit = () => {
        setEditId(null);
        setEditNote(0);
        setEditComment("");
        setError("");
        setMessage("");
    };

    // Enregistrer la modification
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3001/avis/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    note: editNote,
                    commentaire: editComment
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur lors de la modification");
            setMessage("Avis modifié avec succès !");
            setAvis(prev => prev.map(a =>
                a.id === editId ? { ...a, note: editNote, commentaire: editComment } : a
            ));
            setEditId(null);
        } catch (err) {
            setError(err.message || "Erreur réseau");
        }
        setSaving(false);
    };

    // Suppression d’un avis
    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cet avis ?")) return;
        const token = localStorage.getItem("token");
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const res = await fetch(`http://localhost:3001/avis/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erreur lors de la suppression");
            }
            setAvis(prev => prev.filter(a => a.id !== id));
            setMessage("Avis supprimé avec succès !");
        } catch (err) {
            setError(err.message || "Erreur réseau");
        }
        setSaving(false);
    };

    return (
        <div className={`profile-avis-box${darkMode ? " dark-mode" : ""}`}>
            <h3>Mes avis</h3>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            {avis.length === 0 ? (
                <p>Aucun avis déposé.</p>
            ) : (
                <ul className="profile-avis-list">
                    {avis.map(a => (
                        <li key={a.id} className="profile-avis-item">
                            {editId === a.id ? (
                                <form onSubmit={handleSaveEdit} className="profile-avis-edit-form">
                                    <div>
                                        <label>Note :</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={5}
                                            value={editNote}
                                            onChange={e => setEditNote(Number(e.target.value))}
                                            required
                                            style={{ width: 40, marginLeft: 8 }}
                                        />
                                    </div>
                                    <div>
                                        <label>Commentaire :</label>
                                        <textarea
                                            value={editComment}
                                            onChange={e => setEditComment(e.target.value)}
                                            rows={2}
                                            required
                                            style={{ width: "100%", marginTop: 6 }}
                                        />
                                    </div>
                                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                        <button type="submit" disabled={saving}>
                                            {saving ? "Enregistrement..." : "Enregistrer"}
                                        </button>
                                        <button type="button" onClick={handleCancelEdit}>
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="profile-avis-note">
                                        {"★".repeat(a.note)}{"☆".repeat(5 - a.note)}
                                    </div>
                                    <div className="profile-avis-comment">{a.commentaire}</div>
                                    <div className="profile-avis-meta">
                                        {a.product_id && <span>Produit #{a.product_id}</span>}
                                        {a.prestation_id && <span>Prestation #{a.prestation_id}</span>}
                                        <span style={{ marginLeft: 8, color: "#aaa", fontSize: "0.92em" }}>
                                            {a.date_creation ? new Date(a.date_creation).toLocaleDateString() : ""}
                                        </span>
                                    </div>
                                    <div className="profile-avis-actions" style={{ marginTop: 6 }}>
                                        <button onClick={() => handleEdit(a)} style={{ marginRight: 8 }}>
                                            Modifier
                                        </button>
                                        <button onClick={() => handleDelete(a.id)} style={{ color: "#ff6347" }}>
                                            Supprimer
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProfileAvis;
