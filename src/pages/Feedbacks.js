import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/feedbacks.css";
import "../styles/footer.css";

function Feedbacks() {
    const { darkMode } = useContext(PreferencesContext);
    const [avis, setAvis] = useState([]);
    const [avisGlobaux, setAvisGlobaux] = useState([]);
    const [products, setProducts] = useState([]);
    const [prestations, setPrestations] = useState([]);
    const [selectedType, setSelectedType] = useState("product");
    const [selectedId, setSelectedId] = useState("");
    const [note, setNote] = useState(0);
    const [commentaire, setCommentaire] = useState("");
    const [criteres, setCriteres] = useState({ qualite: 0, rapportQualitePrix: 0 });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [monAvis, setMonAvis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- Formulaire avis global (ex-footer) ---
    const [avisGlobal, setAvisGlobal] = useState("");
    const [noteGlobal, setNoteGlobal] = useState(5);
    const [messageGlobal, setMessageGlobal] = useState("");
    const [messageTypeGlobal, setMessageTypeGlobal] = useState("");

    useEffect(() => {
        // Charger la liste des produits
        fetch("http://localhost:3001/burgers")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Erreur chargement burgers:", err));
        // Charger la liste des prestations
        fetch("http://localhost:3001/prestations")
            .then(res => res.json())
            .then(data => setPrestations(data))
            .catch(err => console.error("Erreur chargement prestations:", err));
        // Charger les avis globaux (avis sans product_id ni prestation_id)
        fetch("http://localhost:3001/avis")
            .then(res => res.json())
            .then(data => {
                const globaux = data.filter(a => !a.product_id && !a.prestation_id);
                setAvisGlobaux(globaux);
            });
    }, []);

    useEffect(() => {
        if (!selectedId) return;
        setIsLoading(true);

        // Récupérer tous les avis filtrés selon le type et l'id sélectionné
        fetch("http://localhost:3001/avis")
            .then(res => res.json())
            .then(data => {
                const filteredAvis = data.filter(a =>
                    selectedType === "product"
                        ? a.product_id === parseInt(selectedId)
                        : a.prestation_id === parseInt(selectedId)
                );
                setAvis(filteredAvis);

                // On ne peut pas savoir si l'utilisateur a déjà posté un avis ici sans userId
                setMonAvis(null);
            })
            .catch(err => console.error("Erreur chargement avis:", err))
            .finally(() => setIsLoading(false));
    }, [selectedType, selectedId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");
        setIsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Veuillez vous connecter pour laisser un avis.");
            setMessageType("error");
            setIsLoading(false);
            return;
        }

        const data = {
            note,
            commentaire,
            criteres,
            [selectedType === "product" ? "product_id" : "prestation_id"]: parseInt(selectedId)
        };

        try {
            const method = monAvis ? "PUT" : "POST";
            const url = monAvis ? `http://localhost:3001/avis/${monAvis.id}` : "http://localhost:3001/avis";
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur serveur");
            }

            setMessage(monAvis ? "Votre avis a bien été modifié." : "Merci pour votre avis !");
            setMessageType("success");
            setNote(0);
            setCommentaire("");
            setCriteres({ qualite: 0, rapportQualitePrix: 0 });

            // Recharger les avis
            fetch("http://localhost:3001/avis")
                .then(res => res.json())
                .then(data => {
                    const filteredAvis = data.filter(a =>
                        selectedType === "product"
                            ? a.product_id === parseInt(selectedId)
                            : a.prestation_id === parseInt(selectedId)
                    );
                    setAvis(filteredAvis);
                    setMonAvis(null);
                });
        } catch (err) {
            setMessage(err.message || "Erreur réseau.");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!monAvis) return;
        setIsLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3001/avis/${monAvis.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur serveur");
            }
            setMessage("Votre avis a bien été supprimé.");
            setMessageType("success");
            setMonAvis(null);
            // Recharger les avis
            fetch("http://localhost:3001/avis")
                .then(res => res.json())
                .then(data => {
                    const filteredAvis = data.filter(a =>
                        selectedType === "product"
                            ? a.product_id === parseInt(selectedId)
                            : a.prestation_id === parseInt(selectedId)
                    );
                    setAvis(filteredAvis);
                });
        } catch (err) {
            setMessage(err.message || "Erreur réseau.");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Gestion du formulaire avis global (ex-footer) ---
    const handleSubmitGlobal = (e) => {
        e.preventDefault();
        setMessageGlobal("");
        setMessageTypeGlobal("");
        setIsLoading(true);
        fetch("http://localhost:3001/avis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ note: noteGlobal, commentaire: avisGlobal })
        })
            .then(async res => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Erreur serveur");
                }
                setMessageGlobal("Merci pour votre avis global !");
                setMessageTypeGlobal("success");
                setAvisGlobal("");
                setNoteGlobal(5);
                // Recharger les avis globaux
                fetch("http://localhost:3001/avis")
                    .then(res => res.json())
                    .then(data => {
                        const globaux = data.filter(a => !a.product_id && !a.prestation_id);
                        setAvisGlobaux(globaux);
                    });
            })
            .catch(err => {
                setMessageGlobal(err.message || "Erreur réseau.");
                setMessageTypeGlobal("error");
            })
            .finally(() => setIsLoading(false));
    };

    // Calcul de la moyenne et de la distribution des notes
    const moyenne = avis.length ? (avis.reduce((acc, a) => acc + a.note, 0) / avis.length).toFixed(1) : 0;
    const distribution = [0, 0, 0, 0, 0];
    avis.forEach(a => distribution[a.note - 1]++);

    // Moyenne des avis globaux
    const moyenneGlobale = avisGlobaux.length ? (avisGlobaux.reduce((acc, a) => acc + a.note, 0) / avisGlobaux.length).toFixed(1) : 0;

    return (
        <div className={`feedbacks-root${darkMode ? " dark-mode" : ""}`}>
            <Header />
            <div className="feedbacks-main">
                <h1 className="feedbacks-title">Avis clients</h1>
                <p className="feedbacks-desc">
                    Consultez les avis laissés par nos clients et donnez votre avis sur un produit ou une prestation.
                </p>

                <div className="feedbacks-select">
                    <label>
                        Type :
                        <select
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value)}
                        >
                            <option value="product">Produit</option>
                            <option value="prestation">Prestation</option>
                        </select>
                    </label>
                    <label>
                        {selectedType === "product" ? "Produit" : "Prestation"} :
                        <select
                            value={selectedId}
                            onChange={e => setSelectedId(e.target.value)}
                        >
                            <option value="">-- Sélectionner --</option>
                            {(selectedType === "product" ? products : prestations).map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name || item.titre}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {isLoading && <div className="feedbacks-loading">Chargement en cours...</div>}

                {selectedId && (
                    <>
                        <div className="feedbacks-stats">
                            <h3>Note moyenne : <span className="note">{moyenne}</span>/5</h3>
                            <div className="feedbacks-distribution">
                                <h4>Répartition des notes :</h4>
                                {[1, 2, 3, 4, 5].map((note, idx) => (
                                    <div key={note} className="distribution-row">
                                        <span className="distribution-note">
                                            {note} étoile{note > 1 ? "s" : ""}
                                        </span>
                                        <span className="distribution-count">{distribution[idx]} avis</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="feedbacks-list">
                            <h3>Avis récents</h3>
                            {avis.length === 0 ? (
                                <p>Aucun avis pour ce {selectedType === "product" ? "produit" : "prestation"}.</p>
                            ) : (
                                <ul>
                                    {avis.map(a => (
                                        <li key={a.id}>
                                            <div className="avis-note">{a.note}/5</div>
                                            <div className="avis-commentaire">{a.commentaire}</div>
                                            {a.criteres && (
                                                <div className="avis-criteres">
                                                    {Object.entries(a.criteres).map(([key, value]) => (
                                                        <span key={key}>{key}: {value}/5</span>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <form className="feedbacks-form" onSubmit={handleSubmit}>
                            <h3>{monAvis ? "Modifier mon avis" : "Laisser un avis"}</h3>
                            <label htmlFor="note">Note globale (1-5) :</label>
                            <input
                                id="note"
                                type="number"
                                min="1"
                                max="5"
                                value={note}
                                onChange={e => setNote(Number(e.target.value))}
                                required
                            />
                            {Object.keys(criteres).map(key => (
                                <div key={key} className="avis-critere-input">
                                    <label>{key} (1-5) :</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={criteres[key]}
                                        onChange={e => setCriteres({ ...criteres, [key]: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            ))}
                            <label htmlFor="commentaire">Commentaire :</label>
                            <textarea
                                id="commentaire"
                                value={commentaire}
                                onChange={e => setCommentaire(e.target.value)}
                                required
                                rows={4}
                                placeholder="Votre avis sur ce produit ou prestation..."
                            />
                            <div className="feedbacks-buttons">
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? "Envoi..." : (monAvis ? "Modifier" : "Envoyer")}
                                </button>
                                {monAvis && (
                                    <button type="button" onClick={handleDelete} disabled={isLoading}>
                                        {isLoading ? "Suppression..." : "Supprimer mon avis"}
                                    </button>
                                )}
                            </div>
                        </form>
                        {message && (
                            <div className={`feedbacks-message ${messageType}`}>{message}</div>
                        )}
                    </>
                )}

                {/* --- Section avis globaux --- */}
                <div className="feedbacks-section">
                    <h2>Avis sur le site en général</h2>
                    <div className="feedbacks-stats">
                        <h3>Note moyenne : <span className="note">{moyenneGlobale}</span>/5</h3>
                    </div>
                    <div className="feedbacks-list">
                        <h3>Derniers commentaires</h3>
                        {avisGlobaux.length === 0 ? (
                            <p>Aucun avis global pour le moment.</p>
                        ) : (
                            <ul>
                                {avisGlobaux.map(a => (
                                    <li key={a.id}>
                                        <div className="avis-note">{a.note}/5</div>
                                        <div className="avis-commentaire">{a.commentaire}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <form
                        className={`avis-form${darkMode ? " dark-mode" : ""}`}
                        onSubmit={handleSubmitGlobal}
                    >
                        <h3>Laisser un avis sur le site</h3>
                        <label htmlFor="avis-text">Votre avis :</label>
                        <textarea
                            id="avis-text"
                            value={avisGlobal}
                            onChange={e => setAvisGlobal(e.target.value)}
                            rows={2}
                            required
                            maxLength={250}
                            placeholder="Votre commentaire sur le site..."
                        />
                        <label htmlFor="avis-note">Note :</label>
                        <select
                            id="avis-note"
                            value={noteGlobal}
                            onChange={e => setNoteGlobal(Number(e.target.value))}
                        >
                            {[5, 4, 3, 2, 1].map(n => (
                                <option key={n} value={n}>{n} ★</option>
                            ))}
                        </select>
                        <button type="submit" className="avis-btn" disabled={isLoading}>
                            {isLoading ? "Envoi..." : "Envoyer"}
                        </button>
                        {messageGlobal && (
                            <div className={`avis-message ${messageTypeGlobal}`}>{messageGlobal}</div>
                        )}
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Feedbacks;
