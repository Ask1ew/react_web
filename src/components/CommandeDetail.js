import React, { useState, useEffect, useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/commande.css";

function CommandeDetail() {
    const { darkMode } = useContext(PreferencesContext);

    // Recherche par numéro
    const [searchNum, setSearchNum] = useState("");
    const [searchedCommande, setSearchedCommande] = useState(null);
    const [searchError, setSearchError] = useState("");

    // Historique paginé
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const pageSize = 10;

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true);
        fetch(`http://localhost:3001/commandes?page=${page}&pageSize=${pageSize}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setCommandes(data.commandes || []);
                setTotalPages(data.totalPages || 1);
                setLoading(false);
            })
            .catch(() => {
                setCommandes([]);
                setTotalPages(1);
                setLoading(false);
            });
    }, [page]);

    // Recherche locale dans la page courante
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchError("");
        setSearchedCommande(null);
        if (!searchNum.trim()) return;
        const found = commandes.find(
            c => String(c.id) === searchNum.trim() || (c.numero && String(c.numero) === searchNum.trim())
        );
        if (found) {
            setSearchedCommande(found);
        } else {
            setSearchError("Aucune commande trouvée sur cette page avec ce numéro.");
        }
    };

    // Affichage étape
    const getEtape = (statut) => {
        switch (statut) {
            case "en attente": return "En cours de traitement";
            case "payée": return "Payée (préparation en cours)";
            case "expédiée": return "Expédiée / En transit";
            case "livrée": return "Livrée";
            case "annulée": return "Annulée";
            default: return statut;
        }
    };

    // Pour les étapes visuelles
    const etapes = ["en attente", "payée", "expédiée", "livrée", "annulée"];

    return (
        <div className={`commande-container${darkMode ? " dark-mode" : ""}`}>
            <h3>Suivi de commande</h3>
            <form className="commande-search-form" onSubmit={handleSearch}>
                <label htmlFor="commande-num">Numéro de commande :</label>
                <input
                    id="commande-num"
                    type="text"
                    value={searchNum}
                    onChange={e => setSearchNum(e.target.value)}
                    placeholder="Entrez votre numéro de commande"
                />
                <button type="submit" className="commande-btn">Rechercher</button>
            </form>
            {searchError && <div className="commande-message error">{searchError}</div>}
            {searchedCommande && (
                <div className="commande-suivi-block">
                    <h4>Commande n° {searchedCommande.id}</h4>
                    <p><strong>Date :</strong> {searchedCommande.date_creation ? new Date(searchedCommande.date_creation).toLocaleString() : "-"}</p>
                    <p><strong>Statut :</strong> {getEtape(searchedCommande.statut)}</p>
                    <div className="commande-steps">
                        {etapes.map(etape => (
                            <div
                                key={etape}
                                className={`step${searchedCommande.statut === etape ? " active" : ""}${etape === "annulée" && searchedCommande.statut === "annulée" ? " cancelled" : ""}`}
                            >
                                {getEtape(etape)}
                            </div>
                        ))}
                    </div>
                    <div className="commande-details">
                        <p><strong>Montant :</strong> {searchedCommande.total} €</p>
                        <p><strong>Adresse :</strong> {searchedCommande.adresse}</p>
                        <p><strong>Moyen de paiement :</strong> {searchedCommande.moyen_paiement || "-"}</p>
                        <p><strong>Articles :</strong></p>
                        <ul>
                            {searchedCommande.items && Array.isArray(searchedCommande.items) && searchedCommande.items.length > 0
                                ? searchedCommande.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.name} x{item.count} — {item.price} €
                                    </li>
                                ))
                                : <li>Non disponible</li>
                            }
                        </ul>
                    </div>
                </div>
            )}

            <hr className="commande-separator" />
            <h3>Historique de mes commandes</h3>
            {loading ? (
                <p>Chargement...</p>
            ) : commandes.length === 0 ? (
                <p>Aucune commande passée.</p>
            ) : (
                <>
                    <div className="commande-table-wrapper">
                        <table className="commande-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Adresse</th>
                                <th>Articles</th>
                            </tr>
                            </thead>
                            <tbody>
                            {commandes.map(cmd => (
                                <tr key={cmd.id}>
                                    <td>{cmd.id}</td>
                                    <td>{cmd.date_creation ? new Date(cmd.date_creation).toLocaleDateString() : "-"}</td>
                                    <td>{cmd.total} €</td>
                                    <td>{getEtape(cmd.statut)}</td>
                                    <td>{cmd.adresse}</td>
                                    <td>
                                        <ul>
                                            {cmd.items && Array.isArray(cmd.items) && cmd.items.length > 0
                                                ? cmd.items.map((item, idx) => (
                                                    <li key={idx}>
                                                        {item.name} x{item.count}
                                                    </li>
                                                ))
                                                : <li>Non disponible</li>
                                            }
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="commande-pagination">
                        <button
                            className="commande-btn"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Précédent
                        </button>
                        <span>Page {page} / {totalPages}</span>
                        <button
                            className="commande-btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Suivant
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CommandeDetail;
