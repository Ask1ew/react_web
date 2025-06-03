import React, { useEffect, useState} from "react";
import "../../styles/gestionnaire.css";

function GestionLitiges() {
    const [litiges, setLitiges] = useState([]);
    const [filtreSujet, setFiltreSujet] = useState("");
    const [filtreStatut, setFiltreStatut] = useState("");
    const [filtreDate, setFiltreDate] = useState("");
    const [selectedLitige, setSelectedLitige] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [contactForm, setContactForm] = useState({
        message: "",
        email: ""
    });
    const [contactSent, setContactSent] = useState(false);

    // Statuts possibles pour les litiges (à adapter selon ta table)
    const STATUTS = ["nouveau", "en cours de traitement", "résolu", "fermé"];

    const fetchLitiges = () => {
        fetch("http://localhost:3001/litiges/all", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setLitiges(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Erreur fetch litiges :", err);
                setError("Erreur lors du chargement des litiges");
            });
    };

    useEffect(() => {
        fetchLitiges();
    }, []);

    // Filtres
    const litigesFiltres = litiges.filter(litige => {
        const matchSujet = filtreSujet === "" || litige.sujet.toLowerCase().includes(filtreSujet.toLowerCase());
        const matchStatut = filtreStatut === "" || litige.statut === filtreStatut;
        const matchDate = filtreDate === "" || (litige.date_creation && litige.date_creation.startsWith(filtreDate));
        return matchSujet && matchStatut && matchDate;
    });

    // Modification du statut d'un litige
    const handleStatutChange = (litigeId, newStatut) => {
        fetch(`http://localhost:3001/litiges/${litigeId}/statut`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ statut: newStatut })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setMessage("Statut mis à jour !");
                fetchLitiges();
            })
            .catch(err => {
                setError(err.message || "Erreur lors de la mise à jour du statut");
            });
    };

    // Envoi du message de contact à l'utilisateur
    const handleContactSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        fetch("http://localhost:3001/litiges/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                litigeId: selectedLitige.id,
                message: contactForm.message,
                email: contactForm.email
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setContactSent(true);
                setMessage("Message envoyé à l'utilisateur !");
                setContactForm({ message: "", email: "" });
            })
            .catch(err => {
                setError(err.message || "Erreur lors de l'envoi du message");
            });
    };

    return (
        <div className='gestion-litiges'>
            <div className="gestion-litiges-main">
                <h2>Tableau de bord des litiges</h2>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                {/* Filtres */}
                <div className="litige-filtres">
                    <input
                        type="text"
                        placeholder="Sujet ou type"
                        value={filtreSujet}
                        onChange={e => setFiltreSujet(e.target.value)}
                    />
                    <select
                        value={filtreStatut}
                        onChange={e => setFiltreStatut(e.target.value)}
                    >
                        <option value="">Tous statuts</option>
                        {STATUTS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={filtreDate}
                        onChange={e => setFiltreDate(e.target.value)}
                    />
                    <button onClick={() => { setFiltreSujet(""); setFiltreStatut(""); setFiltreDate(""); }}>
                        Réinitialiser
                    </button>
                </div>

                {/* Tableau des litiges */}
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sujet</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {litigesFiltres.map(litige => (
                        <tr key={litige.id}>
                            <td>{litige.id}</td>
                            <td>{litige.sujet}</td>
                            <td>{litige.date_creation ? new Date(litige.date_creation).toLocaleDateString() : ""}</td>
                            <td>
                                <select
                                    value={litige.statut || "nouveau"}
                                    onChange={e => handleStatutChange(litige.id, e.target.value)}
                                >
                                    {STATUTS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button onClick={() => setSelectedLitige(litige)}>Détails</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Détail litige et contact */}
                {selectedLitige && (
                    <div className="litige-detail">
                        <div className="litige-detail-content">
                            <button className="close-btn" onClick={() => { setSelectedLitige(null); setContactSent(false); }}>
                                ×
                            </button>
                            <h3>Litige #{selectedLitige.id}</h3>
                            <p><strong>Sujet :</strong> {selectedLitige.sujet}</p>
                            <p><strong>Date :</strong> {selectedLitige.date_creation ? new Date(selectedLitige.date_creation).toLocaleDateString() : ""}</p>
                            <p><strong>Statut :</strong> {selectedLitige.statut}</p>
                            <p><strong>Description :</strong> {selectedLitige.description}</p>
                            {selectedLitige.fichier && (
                                <p><strong>Pièce jointe :</strong> <a href={`http://localhost:3001/images/${selectedLitige.fichier}`} target="_blank" rel="noopener noreferrer">Voir fichier</a></p>
                            )}
                            <p><strong>Commande liée :</strong> {selectedLitige.commande_id || "Aucune"}</p>
                            <h4>Contacter l'utilisateur</h4>
                            {contactSent ? (
                                <p className="success-message">Message envoyé à l'utilisateur !</p>
                            ) : (
                                <form className="contact-form" onSubmit={handleContactSubmit}>
                                    <label>Email de l'utilisateur :</label>
                                    <input
                                        type="email"
                                        value={contactForm.email}
                                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                        required
                                    />
                                    <label>Message :</label>
                                    <textarea
                                        value={contactForm.message}
                                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                                        required
                                        rows={4}
                                        placeholder="Votre message à l'utilisateur..."
                                    />
                                    <button type="submit">Envoyer</button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GestionLitiges;
