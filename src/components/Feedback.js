import React, { useState, useContext } from 'react';
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/footer.css';

function Feedback() {
    const { darkMode } = useContext(PreferencesContext);
    const [avis, setAvis] = useState('');
    const [note, setNote] = useState(5);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        fetch('http://localhost:3001/avis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avis, note })
        })
            .then(async res => {
                if (res.ok) {
                    setMessage('Merci pour votre avis !');
                    setMessageType('success');
                    setAvis('');
                    setNote(5);
                } else {
                    const data = await res.json();
                    setMessage(data.error || "Erreur lors de l'envoi.");
                    setMessageType('error');
                }
            })
            .catch(() => {
                setMessage("Erreur réseau.");
                setMessageType('error');
            });
    };

    return (
        <form className={`avis-form${darkMode ? ' dark-mode' : ''}`} onSubmit={handleSubmit}>
            <label htmlFor="avis-text">Votre avis :</label>
            <textarea
                id="avis-text"
                value={avis}
                onChange={e => setAvis(e.target.value)}
                rows={2}
                required
                maxLength={250}
                placeholder="Votre commentaire..."
            />
            <label htmlFor="avis-note">Note :</label>
            <select
                id="avis-note"
                value={note}
                onChange={e => setNote(Number(e.target.value))}
            >
                {[5,4,3,2,1].map(n => (
                    <option key={n} value={n}>{n} ★</option>
                ))}
            </select>
            <button type="submit" className="avis-btn">Envoyer</button>
            {message && (
                <div className={`avis-message ${messageType}`}>{message}</div>
            )}
        </form>
    );
}

export default Feedback;
