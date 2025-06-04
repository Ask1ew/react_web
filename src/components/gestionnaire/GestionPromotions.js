import React, { useEffect, useState } from "react";
import "../../styles/gestionnaire.css";

function GestionPromotions() {
    const [produits, setProduits] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        produitId: "",
        onSale: ""
    });
    const [featuredIds, setFeaturedIds] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Récupérer les produits
    const fetchProduits = () => {
        fetch("http://localhost:3001/produits", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setProduits(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur fetch produits :", err));
    };

    // Récupérer la sélection des produits à mettre en avant
    const fetchFeatured = () => {
        fetch("http://localhost:3001/promotion/selection", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.produits)) setFeaturedIds(data.produits);
                else setFeaturedIds([]);
            })
            .catch(err => {
                console.error("Erreur fetch sélection :", err);
                setFeaturedIds([]);
            });
    };

    useEffect(() => {
        fetchProduits();
        fetchFeatured();
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
                // Retirer le produit de la sélection mise en avant s'il y est
                setFeaturedIds(prev => prev.filter(p => p !== id));
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

    // Gestion de la mise en avant
    const toggleFeatured = (id) => {
        setFeaturedIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const saveFeatured = () => {
        setError("");
        setMessage("");
        fetch("http://localhost:3001/promotion/selection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ produits: featuredIds })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage("Mise en avant sauvegardée !");
                fetchFeatured();
            })
            .catch(err => setError(err.message || "Erreur lors de la sauvegarde"));
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
                    <th>Mettre en avant</th>
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
                                <label className="toggle-featured">
                                    <input
                                        type="checkbox"
                                        checked={featuredIds.includes(p.id)}
                                        onChange={() => toggleFeatured(p.id)}
                                    />
                                    {featuredIds.includes(p.id) ? "Oui" : "Non"}
                                </label>
                            </td>
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
            <button onClick={saveFeatured} className="save-featured-btn">
                Sauvegarder la mise en avant
            </button>
        </div>
    );
}

export default GestionPromotions;
