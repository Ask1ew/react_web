import React, { useEffect, useState } from "react";
import "../../styles/gestionnaire.css";

function GestionPromotions() {
    const [produits, setProduits] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        produitId: "",
        onSale: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchProduits = () => {
        fetch("http://localhost:3001/produits", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setProduits(Array.isArray(data) ? data : []));
    };

    useEffect(() => {
        fetchProduits();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (produit) => {
        setEditing(produit.id);
        setForm({
            produitId: produit.id,
            onSale: produit.onSale || ""
        });
        setMessage("");
        setError("");
    };

    const handleCancel = () => {
        setEditing(null);
        setForm({
            produitId: "",
            onSale: ""
        });
        setMessage("");
        setError("");
    };

    const handleDelete = (id) => {
        if (!window.confirm("Supprimer cette promotion ?")) return;
        fetch(`http://localhost:3001/produits/${id}/promo`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ onSale: 0 })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage("Promotion supprimée !");
                fetchProduits();
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        const id = editing || form.produitId;
        fetch(`http://localhost:3001/produits/${id}/promo`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                onSale: Number(form.onSale)
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage(editing ? "Promotion modifiée !" : "Promotion ajoutée !");
                setEditing(null);
                setForm({
                    produitId: "",
                    onSale: ""
                });
                fetchProduits();
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    return (
        <div className="gestion-promotions">
            <h2>Gestion des promotions</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form className="promotion-form" onSubmit={handleSubmit}>
                <select
                    name="produitId"
                    value={form.produitId}
                    onChange={handleFormChange}
                    required
                >
                    <option value="">Choisir un produit</option>
                    {produits.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="onSale"
                    placeholder="Réduction (%)"
                    value={form.onSale}
                    onChange={handleFormChange}
                    min="1"
                    max="100"
                    required
                />
                <button type="submit">
                    {editing ? "Modifier la promotion" : "Ajouter la promotion"}
                </button>
                {editing && (
                    <button type="button" onClick={handleCancel}>
                        Annuler
                    </button>
                )}
            </form>
            <table>
                <thead>
                <tr>
                    <th>Produit</th>
                    <th>Réduction</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {produits
                    .filter(p => p.onSale > 0)
                    .map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.onSale}%</td>
                            <td>
                                <button onClick={() => handleEdit(p)}>Modifier</button>
                                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 8, color: "red" }}>
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

export default GestionPromotions;
