import React, { useEffect, useState, useRef, useContext } from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import "../../styles/gestionnaire.css";

// Génère la structure d'un mois pour le calendrier
function generateMonthCalendar(year, month) {
    const weeks = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    let startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    while (startDate <= lastDay || startDate.getDay() !== 0) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push(new Date(startDate.getTime()));
            startDate.setDate(startDate.getDate() + 1);
        }
        weeks.push(week);
    }
    return weeks;
}
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function GestionPrestations() {
    const { darkMode } = useContext(PreferencesContext);
    const [prestations, setPrestations] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        titre: "",
        description: "",
        prix: "",
        duree: "",
        image: null,
        categorie: "",
        disponible: 1
    });
    const [slots, setSlots] = useState([]);
    const [selectedPrestation, setSelectedPrestation] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef();

    const today = new Date();

    const fetchPrestations = () => {
        fetch("http://localhost:3001/prestations", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setPrestations(Array.isArray(data) ? data : []));
    };

    const fetchReservations = () => {
        fetch("http://localhost:3001/reservations/all", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setReservations(Array.isArray(data) ? data : []));
    };

    useEffect(() => {
        fetchPrestations();
        fetchReservations();
        const interval = setInterval(() => {
            fetch("http://localhost:3001/reservations/all", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > reservations.length) {
                        setReservations(data);
                    }
                });
        }, );
        return () => clearInterval(interval);
    }, []);

    // Gestion créneaux en temps réel
    const fetchSlots = (prestationId) => {
        fetch(`http://localhost:3001/slots?prestationId=${prestationId}`)
            .then(res => res.json())
            .then(data => setSlots(Array.isArray(data) ? data : []));
    };

    const handleFormChange = (e) => {
        const { name, value, files, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "file" ? files[0] : value
        }));
    };

    const handleEdit = (prestation) => {
        setEditing(prestation.id);
        setForm({
            titre: prestation.titre || "",
            description: prestation.description || "",
            prix: prestation.prix || "",
            duree: prestation.duree || "",
            image: null,
            categorie: prestation.categorie || "",
            disponible: prestation.disponible
        });
        setMessage("");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCancel = () => {
        setEditing(null);
        setForm({
            titre: "",
            description: "",
            prix: "",
            duree: "",
            image: null,
            categorie: "",
            disponible: 1
        });
        setMessage("");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = (id) => {
        if (!window.confirm("Supprimer cette prestation ?")) return;
        fetch(`http://localhost:3001/prestations/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la suppression.");
                setMessage("Prestation supprimée !");
                fetchPrestations();
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    // Création ou modification d'une prestation
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        const url = editing
            ? `http://localhost:3001/prestations/${editing}`
            : "http://localhost:3001/prestations";
        const method = editing ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                titre: form.titre,
                description: form.description,
                prix: form.prix,
                duree: form.duree,
                categorie: form.categorie,
                disponible: form.disponible
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                if (form.image && data.id) {
                    const imgData = new FormData();
                    imgData.append("image", form.image);
                    imgData.append("prestationId", data.id); // pour une prestation
                    fetch("http://localhost:3001/upload", {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                        body: imgData
                    })
                        .then(res2 => res2.json())
                        .then(() => {
                            setMessage(editing ? "Prestation modifiée !" : "Prestation ajoutée !");
                            setEditing(null);
                            setForm({
                                titre: "",
                                description: "",
                                prix: "",
                                duree: "",
                                image: null,
                                categorie: "",
                                disponible: 1
                            });
                            if (fileInputRef.current) fileInputRef.current.value = "";
                            fetchPrestations();
                        });
                } else {
                    setMessage(editing ? "Prestation modifiée !" : "Prestation ajoutée !");
                    setEditing(null);
                    setForm({
                        titre: "",
                        description: "",
                        prix: "",
                        duree: "",
                        image: null,
                        categorie: "",
                        disponible: 1
                    });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    fetchPrestations();
                }
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    const [showSlots, setShowSlots] = useState(false);
    const [slotsMonth, setSlotsMonth] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });

    const handleShowSlots = (prestation) => {
        setSelectedPrestation(prestation);
        setShowSlots(true);
        setSlotsMonth({ year: today.getFullYear(), month: today.getMonth() + 1 });
        fetchSlots(prestation.id);
    };

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const weeks = generateMonthCalendar(slotsMonth.year, slotsMonth.month);
    const slotsByDate = {};
    slots.forEach(slot => {
        if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
        slotsByDate[slot.date].push(slot);
    });
    const prevMonth = () => {
        setSlotsMonth(prev =>
            prev.month === 1
                ? { year: prev.year - 1, month: 12 }
                : { year: prev.year, month: prev.month - 1 }
        );
    };
    const nextMonth = () => {
        setSlotsMonth(prev =>
            prev.month === 12
                ? { year: prev.year + 1, month: 1 }
                : { year: prev.year, month: prev.month + 1 }
        );
    };

    return (
        <div className={`gestion-prestations${darkMode ? " dark-mode" : ""}`}>
            <h2>Gestion des prestations</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form className="prestation-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="titre"
                    placeholder="Titre"
                    value={form.titre}
                    onChange={handleFormChange}
                    required
                />
                <input
                    type="text"
                    name="categorie"
                    placeholder="Catégorie"
                    value={form.categorie}
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
                    name="prix"
                    placeholder="Prix"
                    value={form.prix}
                    onChange={handleFormChange}
                    required
                    min="0"
                    step="0.01"
                />
                <input
                    type="text"
                    name="duree"
                    placeholder="Durée (ex: 1h30)"
                    value={form.duree}
                    onChange={handleFormChange}
                    required
                />
                <select
                    name="disponible"
                    value={form.disponible}
                    onChange={handleFormChange}
                >
                    <option value={1}>Disponible</option>
                    <option value={0}>Indisponible</option>
                </select>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFormChange}
                />
                <button type="submit">
                    {editing ? "Modifier la prestation" : "Ajouter la prestation"}
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
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Description</th>
                    <th>Prix</th>
                    <th>Durée</th>
                    <th>Image</th>
                    <th>Disponible</th>
                    <th>Créneaux</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {prestations.map(prestation => (
                    <tr key={prestation.id}>
                        <td>{prestation.titre}</td>
                        <td>{prestation.categorie}</td>
                        <td>{prestation.description}</td>
                        <td>{prestation.prix} €</td>
                        <td>{prestation.duree}</td>
                        <td>
                            {prestation.image && (
                                <img src={prestation.image} alt={prestation.titre} style={{ width: 50, borderRadius: 6 }} />
                            )}
                        </td>
                        <td>{prestation.disponible ? "Oui" : "Non"}</td>
                        <td>
                            <button onClick={() => handleShowSlots(prestation)}>
                                Voir créneaux
                            </button>
                        </td>
                        <td>
                            <button onClick={() => handleEdit(prestation)}>Modifier</button>
                            <button onClick={() => handleDelete(prestation.id)} style={{ marginLeft: 8, color: "red" }}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Créneaux en format calendrier */}
            {showSlots && selectedPrestation && (
                <div className="slots-modal">
                    <div className="slots-content">
                        <h4>Créneaux pour {selectedPrestation.titre}</h4>
                        <button onClick={() => setShowSlots(false)} style={{ float: "right" }}>Fermer</button>
                        <div className="mini-calendar">
                            <div className="agenda-header">
                                <button onClick={prevMonth} aria-label="Mois précédent">&lt;</button>
                                <h3>{monthNames[slotsMonth.month - 1]} {slotsMonth.year}</h3>
                                <button onClick={nextMonth} aria-label="Mois suivant">&gt;</button>
                            </div>
                            <table className="agenda-calendar">
                                <thead>
                                <tr>
                                    <th>Dim</th><th>Lun</th><th>Mar</th><th>Mer</th><th>Jeu</th><th>Ven</th><th>Sam</th>
                                </tr>
                                </thead>
                                <tbody>
                                {weeks.map((week, i) => (
                                    <tr key={i}>
                                        {week.map((day, idx) => {
                                            const dayStr = formatDate(day);
                                            const isCurrentMonth = day.getMonth() + 1 === slotsMonth.month;
                                            const daySlots = slotsByDate[dayStr] || [];
                                            return (
                                                <td key={idx} className={isCurrentMonth ? "current-month" : "other-month"}>
                                                    <div className="day-number">{isCurrentMonth ? day.getDate() : ''}</div>
                                                    <div className="day-slots">
                                                        {daySlots.map(slot => (
                                                            <span
                                                                key={slot.heure}
                                                                className={`slot-dot ${slot.disponible ? "slot-dispo" : "slot-reserve"}`}
                                                                title={`${slot.heure} ${slot.disponible ? "(dispo)" : "(réservé)"}`}
                                                            ></span>
                                                        ))}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="slots-legend">
                                <span><span className="slot-dot slot-dispo"></span> Disponible</span>
                                <span><span className="slot-dot slot-reserve"></span> Réservé</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Liste des réservations */}
            <h3 style={{ marginTop: 40 }}>Réservations</h3>
            <table>
                <thead>
                <tr>
                    <th>Prestation</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Client</th>
                    <th>Commentaire</th>
                </tr>
                </thead>
                <tbody>
                {reservations
                    .filter(r => r.statut !== "annulée")
                    .map(r => (
                        <tr key={r.id}>
                            <td>{r.prestation_titre}</td>
                            <td>{r.date_reservation ? new Date(r.date_reservation).toLocaleString() : ""}</td>
                            <td>{r.statut}</td>
                            <td>{r.user_id}</td>
                            <td>{r.commentaire}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GestionPrestations;
