import React, { useState, useEffect } from "react";
import "../../styles/gestionnaire.css";

function GestionAccueil() {
    const [produits, setProduits] = useState([]);
    const [prestations, setPrestations] = useState([]);
    const [selection, setSelection] = useState({
        produits: [],
        prestations: []
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadSelection = () => {
        fetch("http://localhost:3001/accueil/selection", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    setSelection({
                        produits: Array.isArray(data.produits) ? data.produits : [],
                        prestations: Array.isArray(data.prestations) ? data.prestations : []
                    });
                }
            })
            .catch(err => console.error("Erreur fetch sélection :", err));
    };

    useEffect(() => {
        // Récupérer les produits
        fetch("http://localhost:3001/produits", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setProduits(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur fetch produits :", err));

        // Récupérer les prestations
        fetch("http://localhost:3001/prestations", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setPrestations(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur fetch prestations :", err));

        // Récupérer la sélection accueil
        loadSelection();
    }, []);

    const toggleSelection = (type, id) => {
        setSelection(prev => ({
            ...prev,
            [type]: prev[type].includes(id)
                ? prev[type].filter(item => item !== id)
                : [...prev[type], id]
        }));
    };

    const moveUp = (type, index) => {
        if (index === 0) return;
        setSelection(prev => {
            const newSelection = { ...prev };
            const temp = newSelection[type][index - 1];
            newSelection[type][index - 1] = newSelection[type][index];
            newSelection[type][index] = temp;
            return newSelection;
        });
    };

    const moveDown = (type, index) => {
        if (index === selection[type].length - 1) return;
        setSelection(prev => {
            const newSelection = { ...prev };
            const temp = newSelection[type][index + 1];
            newSelection[type][index + 1] = newSelection[type][index];
            newSelection[type][index] = temp;
            return newSelection;
        });
    };

    const saveSelection = () => {
        fetch("http://localhost:3001/accueil/selection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(selection)
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage("Sélection sauvegardée !");
                // Recharger la sélection depuis le backend
                loadSelection();
            })
            .catch(err => setError(err.message || "Erreur lors de la sauvegarde"));
    };

    const getName = (type, id) => {
        if (type === "produits") return produits.find(p => p.id === id)?.name || id;
        if (type === "prestations") return prestations.find(p => p.id === id)?.titre || id;
        return id;
    };

    return (
        <div className="gestion-accueil">
            <h2>Gestion de la page d'accueil</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="accueil-categories">
                <div className="accueil-categorie">
                    <h3>Produits mis en avant</h3>
                    <ul className="accueil-list">
                        {produits.map(p => (
                            <li key={p.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selection.produits.includes(p.id)}
                                        onChange={() => toggleSelection("produits", p.id)}
                                    />
                                    {p.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="accueil-categorie">
                    <h3>Prestations mises en avant</h3>
                    <ul className="accueil-list">
                        {prestations.map(p => (
                            <li key={p.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selection.prestations.includes(p.id)}
                                        onChange={() => toggleSelection("prestations", p.id)}
                                    />
                                    {p.titre}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="accueil-selection">
                <h3>Sélection actuelle pour la page d'accueil</h3>
                <div className="accueil-selection-list">
                    {Object.entries(selection).map(([type, ids]) => (
                        <div key={type} className="accueil-selection-item">
                            <h4>{type === "produits" ? "Produits" : "Prestations"}</h4>
                            {ids.length === 0 ? (
                                <p>Aucun élément sélectionné</p>
                            ) : (
                                <ul>
                                    {ids.map((id, idx) => (
                                        <li key={id}>
                                            <span>{getName(type, id)}</span>
                                            <div className="accueil-selection-actions">
                                                <button onClick={() => moveUp(type, idx)}>↑</button>
                                                <button onClick={() => moveDown(type, idx)}>↓</button>
                                                <button onClick={() => toggleSelection(type, id)}>Retirer</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={saveSelection} className="accueil-save-btn">
                Sauvegarder la sélection
            </button>
        </div>
    );
}

export default GestionAccueil;
