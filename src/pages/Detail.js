import React, { useState, useContext, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/detail.css';

function Detail() {
    const location = useLocation();
    // Peut recevoir un produit (item) ou une prestation (service)
    const item = location.state?.item;
    const prestation = location.state?.service;
    const { darkMode } = useContext(PreferencesContext);

    // États pour l’édition produit
    const [isEditing, setIsEditing] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item);
    const [image, setImage] = useState(null);

    // Récupération de l'userId connecté
    const [userId, setUserId] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userId = localStorage.getItem('userId');
            setUserId(userId);
        }
    }, []);

    // --- Affichage si rien n'est sélectionné ---
    if (!item && !prestation) {
        return (
            <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
                <Header />
                <div className="detail-container">
                    <h1>Aucun élément sélectionné</h1>
                    <p>Veuillez sélectionner un produit ou une prestation depuis la liste</p>
                </div>
                <Footer />
            </div>
        );
    }

    // --- Affichage d'une prestation ---
    if (prestation) {
        return (
            <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
                <Header />
                <div className="detail-container">
                    <div className="detail-title">
                        <h1>Détail de la prestation</h1>
                    </div>
                    <div className="detail-content">
                        <img src={prestation.image} alt={prestation.titre} className="detail-image" />
                        <div className="detail-info">
                            <p><strong>Titre :</strong> {prestation.titre}</p>
                            <p><strong>Catégorie :</strong> {prestation.categorie || '-'}</p>
                            <p><strong>Prix :</strong> {Number(prestation.prix).toFixed(2)}€</p>
                            <p><strong>Durée :</strong> {prestation.duree} min</p>
                            <p><strong>Description :</strong> {prestation.description || "Description non disponible"}</p>
                            <p><strong>Disponibilité :</strong> {prestation.disponible ? "Disponible" : "Indisponible"}</p>
                            {/* Ajoute ici un bouton "Réserver" ou "Choisir un créneau" selon ton workflow */}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // --- Affichage d'un produit (item) ---
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setUpdatedItem(prev => ({
                ...prev,
                [name]: checked ? 1 : 0
            }));
        } else {
            setUpdatedItem(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpdateBurger = () => {
        fetch(`http://localhost:3001/burgers/${updatedItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: updatedItem.name,
                price: parseFloat(updatedItem.price),
                description: updatedItem.description,
                onSale: updatedItem.onSale
            })
        })
            .then(response => response.json())
            .then(data => {
                setUpdatedItem(data);
            })
            .catch(error => console.error('Erreur lors de la requête PUT :', error));
    };

    const handleImageUpload = () => {
        if (!image) return;
        const formData = new FormData();
        formData.append('image', image);
        formData.append('burgerId', updatedItem.id);

        fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setUpdatedItem(prev => ({ ...prev, image: data.imageUrl }));
            })
            .catch(error => {
                console.error('Erreur téléchargement image :', error);
            });
    };

    const handleSave = () => {
        handleUpdateBurger();
        if (image) {
            handleImageUpload();
        }
        setIsEditing(false);
    };

    return (
        <div className={`detail-page ${darkMode ? 'dark-mode' : ''}`}>
            <Header />
            <div className="detail-container">
                <div className="detail-title">
                    <h1>Détails du {updatedItem.name}</h1>
                </div>
                <div className="detail-content">
                    <img src={updatedItem.image} alt={updatedItem.name} className="detail-image" />
                    <div className="detail-info">
                        {!isEditing ? (
                            <>
                                <p><strong>Nom :</strong> {updatedItem.name}</p>
                                <p><strong>Prix :</strong> {Number(updatedItem.price).toFixed(2)}€</p>
                                {!!updatedItem.onSale && <p className="sale-alert">🏷️ Article en solde !</p>}
                                <p><strong>Description :</strong> {updatedItem.description || "Description non disponible"}</p>
                                {userId === '1' && (
                                    <button className="button-Add" onClick={() => setIsEditing(true)}>
                                        Modifier
                                    </button>
                                )}
                            </>
                        ) : (
                            <div>
                                <label>Nom: </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedItem.name}
                                    onChange={handleInputChange}
                                />
                                <br />
                                <label className="detail-label">Prix: </label>
                                <input
                                    className="detail-input"
                                    type="number"
                                    name="price"
                                    value={updatedItem.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                />
                                <br />
                                <label>
                                    En solde:
                                    <input
                                        type="checkbox"
                                        name="onSale"
                                        checked={!!updatedItem.onSale}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <br />
                                <label>Description: </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={updatedItem.description || ""}
                                    onChange={handleInputChange}
                                />
                                <br />
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <br />
                                <button className="button-Add" onClick={handleSave}>
                                    Enregistrer
                                </button>
                                <button className="button-Add" onClick={() => setIsEditing(false)}>
                                    Annuler
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Detail;
