import React, { useEffect, useState, useContext, useRef } from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import "../../styles/gestionnaire.css";

function GestionArticles() {
    const { darkMode } = useContext(PreferencesContext);
    const [articles, setArticles] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image: null,
        category: "",
        onSale: 0
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef();

    const fetchArticles = () => {
        fetch("http://localhost:3001/produits", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setArticles(Array.isArray(data) ? data : []));
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    // Gestion du formulaire (création ou modification)
    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleEdit = (article) => {
        setEditing(article.id);
        setForm({
            name: article.name || "",
            description: article.description || "",
            price: article.price || "",
            image: null,
            category: article.category || "",
            onSale: article.onSale || 0
        });
        setMessage("");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCancel = () => {
        setEditing(null);
        setForm({ name: "", description: "", price: "", image: null, category: "", onSale: 0 });
        setMessage("");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = (id) => {
        if (!window.confirm("Supprimer cet article ?")) return;
        fetch(`http://localhost:3001/produits/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la suppression.");
                setMessage("Article supprimé !");
                fetchArticles();
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    // Création ou modification d'un article (hors image)
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        const url = editing
            ? `http://localhost:3001/produits/${editing}`
            : "http://localhost:3001/produits";
        const method = editing ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                name: form.name,
                description: form.description,
                price: form.price,
                category: form.category,
                onSale: form.onSale
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                // Si une image a été sélectionnée, on l'upload ensuite
                if (form.image && data.id) {
                    const imgData = new FormData();
                    imgData.append("image", form.image);
                    imgData.append("burgerId", data.id);
                    fetch("http://localhost:3001/upload", {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                        body: imgData
                    })
                        .then(res2 => res2.json())
                        .then(() => {
                            setMessage(editing ? "Article modifié !" : "Article ajouté !");
                            setEditing(null);
                            setForm({ name: "", description: "", price: "", image: null, category: "", onSale: 0 });
                            if (fileInputRef.current) fileInputRef.current.value = "";
                            fetchArticles();
                        });
                } else {
                    setMessage(editing ? "Article modifié !" : "Article ajouté !");
                    setEditing(null);
                    setForm({ name: "", description: "", price: "", image: null, category: "", onSale: 0 });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    fetchArticles();
                }
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    return (
        <div className={`gestion-articles${darkMode ? " dark-mode" : ""}`}>
            <h2>Gestion des articles</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form className="article-form" onSubmit={handleSubmit}>
                <p>Nom :</p>
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                />
                <p>Catégorie :</p>
                <input
                    type="text"
                    name="category"
                    placeholder="Catégorie"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                />
                <p>Description :</p>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleFormChange}
                    required
                />
                <p>Prix :</p>
                <input
                    type="number"
                    name="price"
                    placeholder="Prix"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    min="0"
                    step="0.01"
                />
                <p>Pourcentage de réduction :</p>
                <input
                    type="number"
                    name="onSale"
                    placeholder="Réduction (%)"
                    value={form.onSale}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                />
                <p>Image :</p>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFormChange}
                />
                <button type="submit">
                    {editing ? "Modifier l'article" : "Ajouter l'article"}
                </button>
                {editing && (
                    <button type="button" onClick={handleCancel} style={{ marginLeft: 12 }}>
                        Annuler
                    </button>
                )}
            </form>
            <table>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Description</th>
                    <th>Prix</th>
                    <th>Réduction</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {articles.map(article => (
                    <tr key={article.id}>
                        <td>{article.name}</td>
                        <td>{article.category}</td>
                        <td>{article.description}</td>
                        <td>{article.price} €</td>
                        <td>{article.onSale ? `${article.onSale}%` : "-"}</td>
                        <td>
                            {article.image && (
                                <img src={article.image} alt={article.name} style={{ width: 50, borderRadius: 6 }} />
                            )}
                        </td>
                        <td>
                            <button onClick={() => handleEdit(article)}>Modifier</button>
                            <button onClick={() => handleDelete(article.id)} style={{ marginLeft: 8, color: "red" }}>
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

export default GestionArticles;
