import React, { useEffect, useState, useContext, useRef } from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import "../../styles/gestionnaire.css";

function GestionArticles() {
    const { darkMode } = useContext(PreferencesContext);
    const [articles, setArticles] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", price: "", image: null, category: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef();

    const fetchArticles = () => {
        fetch("http://localhost:3001/burgers", {
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
            category: article.category || ""
        });
        setMessage("");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCancel = () => {
        setEditing(null);
        setForm({ name: "", description: "", price: "", image: null, category: "" });
        setMessage("");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = (id) => {
        if (!window.confirm("Supprimer cet article ?")) return;
        fetch(`http://localhost:3001/burgers/${id}`, {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("category", form.category);
        if (form.image) formData.append("image", form.image);

        const url = editing
            ? `http://localhost:3001/burgers/${editing}`
            : "http://localhost:3001/burgers";
        const method = editing ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage(editing ? "Article modifié !" : "Article ajouté !");
                setEditing(null);
                setForm({ name: "", description: "", price: "", image: null, category: "" });
                if (fileInputRef.current) fileInputRef.current.value = "";
                fetchArticles();
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    return (
        <div className={`gestion-articles${darkMode ? " dark-mode" : ""}`}>
            <h2>Gestion des articles</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form className="article-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Catégorie"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleFormChange}
                    required
                />
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
