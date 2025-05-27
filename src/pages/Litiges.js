import React, { useState, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PreferencesContext } from "../context/PreferencesContext";
import "../styles/litiges.css";

function Litiges() {
    const { darkMode } = useContext(PreferencesContext);
    const [sujet, setSujet] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");
        const formData = new FormData();
        formData.append("sujet", sujet);
        formData.append("description", description);
        if (file) formData.append("file", file);

        try {
            const res = await fetch("http://localhost:3001/litiges", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
                }
            });
            if (res.ok) {
                setMessage("Votre litige a bien été transmis. Nous vous répondrons dans les plus brefs délais.");
                setMessageType("success");
                setSujet("");
                setDescription("");
                setFile(null);
            } else {
                setMessage("Erreur lors de l'envoi du litige.");
                setMessageType("error");
            }
        } catch {
            setMessage("Erreur réseau.");
            setMessageType("error");
        }
    };

    return (
        <div className={`litiges-root${darkMode ? " dark-mode" : ""}`}>
            <Header />
            <div className="litiges-main">
                <h1 className="litiges-title">Déclarer un litige</h1>
                <p className="litiges-desc">
                    Vous avez rencontré un problème avec une commande ou une prestation&nbsp;?
                    Merci de remplir le formulaire ci-dessous, notre équipe vous recontactera rapidement.
                </p>
                <form className="litiges-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <label htmlFor="sujet">Sujet du litige :</label>
                    <input
                        id="sujet"
                        type="text"
                        value={sujet}
                        onChange={e => setSujet(e.target.value)}
                        required
                        placeholder="Ex : Livraison en retard, erreur de commande..."
                    />

                    <label htmlFor="description">Description :</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        rows={4}
                        placeholder="Décrivez précisément votre problème..."
                    />

                    <label htmlFor="file">Ajouter une pièce jointe (optionnel) :</label>
                    <input
                        id="file"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={e => setFile(e.target.files[0])}
                    />

                    <button className="litiges-btn" type="submit">Envoyer le litige</button>
                    {message && (
                        <div className={`litiges-message ${messageType}`}>{message}</div>
                    )}
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Litiges;
