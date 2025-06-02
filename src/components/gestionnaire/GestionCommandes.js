import React, { useEffect, useState } from "react";
import "../../styles/gestionnaire.css";

// Statuts possibles pour les commandes
const STATUTS = [
    "en attente",
    "payée",
    "expédiée",
    "annulée"
];

function GestionCommandes() {
    const [commandes, setCommandes] = useState([]);
    const [filtreNumero, setFiltreNumero] = useState("");
    const [filtreStatut, setFiltreStatut] = useState("");
    const [filtreDate, setFiltreDate] = useState("");
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [stats, setStats] = useState({}); // Pour les stats de vente

    // Récupérer toutes les commandes
    const fetchCommandes = () => {
        fetch("http://localhost:3001/commandes/all", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setCommandes(Array.isArray(data) ? data : []));
    };

    // Récupérer les stats de vente
    const fetchStats = () => {
        fetch("http://localhost:3001/commandes/stats", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => setStats(data || {}));
    };

    useEffect(() => {
        fetchCommandes();
        fetchStats();
    }, []);

    // Modification du statut d'une commande
    const handleStatutChange = (commandeId, newStatut) => {
        fetch(`http://localhost:3001/commandes/${commandeId}/statut`, {
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
                fetchCommandes();
            })
            .catch(err => setError(err.message || "Erreur réseau."));
    };

    // Filtres
    const commandesFiltrees = commandes.filter(cmd => {
        const matchNumero = filtreNumero === "" || String(cmd.id).includes(filtreNumero);
        const matchStatut = filtreStatut === "" || cmd.statut === filtreStatut;
        const matchDate = filtreDate === "" || (cmd.date_creation && cmd.date_creation.startsWith(filtreDate));
        return matchNumero && matchStatut && matchDate;
    });

    // Statistiques simples : top produits
    const topVentes = stats.topProduits || [];
    const ventesParMois = stats.ventesParMois || [];

    return (
        <div className="gestion-commandes">
            <h2>Tableau de bord des commandes</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Filtres */}
            <div className="commande-filtres">
                <input
                    type="text"
                    placeholder="N° commande"
                    value={filtreNumero}
                    onChange={e => setFiltreNumero(e.target.value)}
                />
                <select
                    value={filtreStatut}
                    onChange={e => setFiltreStatut(e.target.value)}
                >
                    <option value="">Tous statuts</option>
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                    type="date"
                    value={filtreDate}
                    onChange={e => setFiltreDate(e.target.value)}
                />
                <button onClick={() => {
                    setFiltreNumero(""); setFiltreStatut(""); setFiltreDate("");
                }}>Réinitialiser</button>
            </div>

            {/* Tableau des commandes */}
            <table>
                <thead>
                <tr>
                    <th>N°</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Statut</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {commandesFiltrees.map(cmd => (
                    <tr key={cmd.id}>
                        <td>{cmd.id}</td>
                        <td>{cmd.date_creation ? new Date(cmd.date_creation).toLocaleString() : ""}</td>
                        <td>{cmd.nom} {cmd.prenom}</td>
                        <td>
                            <select
                                value={cmd.statut}
                                onChange={e => handleStatutChange(cmd.id, e.target.value)}
                            >
                                {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </td>
                        <td>{cmd.total} €</td>
                        <td>
                            <button onClick={() => setSelectedCommande(cmd)}>
                                Détails
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Détail commande en modal */}
            {selectedCommande && (
                <div className="commande-modal">
                    <div className="commande-modal-content">
                        <button className="close-btn" onClick={() => setSelectedCommande(null)}>×</button>
                        <h3>Commande #{selectedCommande.id}</h3>
                        <p><strong>Date :</strong> {selectedCommande.date_creation ? new Date(selectedCommande.date_creation).toLocaleString() : ""}</p>
                        <p><strong>Client :</strong> {selectedCommande.nom} {selectedCommande.prenom} ({selectedCommande.email})</p>
                        <p><strong>Adresse :</strong> {selectedCommande.adresse}</p>
                        <p><strong>Téléphone :</strong> {selectedCommande.telephone}</p>
                        <h4>Articles :</h4>
                        <ul>
                            {Array.isArray(selectedCommande.items)
                                ? selectedCommande.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.name} x{item.count} — {item.price} €
                                    </li>
                                ))
                                : <li>Aucun article</li>
                            }
                        </ul>
                        <p><strong>Total :</strong> {selectedCommande.total} €</p>
                        <p><strong>Statut :</strong> {selectedCommande.statut}</p>
                    </div>
                </div>
            )}

            {/* Statistiques de vente */}
            <div className="commande-stats">
                <h3>Statistiques de vente</h3>
                <div className="stats-row">
                    <div className="stats-block">
                        <h4>Top produits</h4>
                        <ul>
                            {topVentes.length === 0 ? (
                                <li>Aucune vente</li>
                            ) : (
                                topVentes.map((prod, i) => (
                                    <li key={prod.id}>
                                        {i + 1}. {prod.name} — {prod.quantite} vendus
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                    <div className="stats-block">
                        <h4>Ventes par mois</h4>
                        <div className="stats-bar-chart">
                            {ventesParMois.map((m, i) => (
                                <div key={i} className="bar-group">
                                    <div className="bar-label">{m.mois}/{m.annee}</div>
                                    <div className="bar-outer">
                                        <div
                                            className="bar-inner"
                                            style={{ width: `${m.total * 2}px`, background: "#1eb1d4" }}
                                        ></div>
                                        <span className="bar-value">{m.total} €</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GestionCommandes;
