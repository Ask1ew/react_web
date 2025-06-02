import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/fidelity.css";

function FidelityExchangeModal({ open, onClose, type, onExchange }) {
    const [items, setItems] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        if (!open) return;
        fetch("http://localhost:3001/")
            .then(res => res.json())
            .then(data => {
                if (type === "burger") {
                    setItems(data.filter(item => item.category === "burger" || !item.category));
                } else if (type === "boisson") {
                    setItems(data.filter(item => item.category === "boisson"));
                }
            });
    }, [open, type]);

    const handleChoose = (item) => {
        addToCart({ ...item, fidelityDiscount: true, count: 1 });
        if (onExchange) onExchange(item); // Appelle la consommation des points ici
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fidelity-modal-backdrop">
            <div className="fidelity-modal">
                <h3>Choisissez votre {type === "burger" ? "burger" : "boisson"} offert</h3>
                <ul className="fidelity-modal-list">
                    {items.map(item => (
                        <li key={item.id} onClick={() => handleChoose(item)}>
                            <img src={item.image} alt={item.name} width={60} />
                            <span>{item.name}</span>
                        </li>
                    ))}
                </ul>
                <button className="fidelity-btn" onClick={onClose}>Annuler</button>
            </div>
        </div>
    );
}

export default FidelityExchangeModal;
