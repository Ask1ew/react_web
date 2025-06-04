import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/livredor.css";

function LivreDor() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [temoignages, setTemoignages] = useState([]);
    const [questions, setQuestions] = useState([
        { id: "q1", texte: "Le site est-il facile à utiliser ?", reponse: null },
        { id: "q2", texte: "Recommanderiez-vous ce site à un ami ?", reponse: null }
    ]);
    const [messageEnvoye, setMessageEnvoye] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/livredor')
            .then(res => res.json())
            .then(data => setTemoignages(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur chargement témoignages:", err));
    }, []);

    const handleQuestionChange = (id, reponse) => {
        setQuestions(prev => prev.map(q =>
            q.id === id ? { ...q, reponse } : q
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const reponses = {};
        questions.forEach(q => {
            if (q.reponse) reponses[q.id] = q.reponse;
        });
        fetch('http://localhost:3001/livredor', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nom,
                email,
                message,
                reponses
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessageEnvoye(true);
                    setNom("");
                    setEmail("");
                    setMessage("");
                    setQuestions(prev => prev.map(q => ({ ...q, reponse: null })));
                }
            })
            .catch(err => console.error("Erreur envoi témoignage:", err));
    };

    return (
        <div className="livredor-page">
            <Header />
            <main className="livredor-main">
                <h2>Livre d'Or</h2>
                <p>Partagez votre expérience avec nous !</p>

                {messageEnvoye ? (
                    <div className="success-message">
                        Merci pour votre témoignage ! Il sera publié après modération.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="livredor-form">
                        <div className="form-group">
                            <label>Nom (ou pseudo)</label>
                            <input
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Votre témoignage</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={4}
                                placeholder="Décrivez votre expérience..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Questionnaire d’expérience</label>
                            {questions.map(q => (
                                <div key={q.id} className="question">
                                    <p>{q.texte}</p>
                                    <div className="options">
                                        <label>
                                            <input
                                                type="radio"
                                                name={q.id}
                                                checked={q.reponse === "oui"}
                                                onChange={() => handleQuestionChange(q.id, "oui")}
                                            />
                                            Oui
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={q.id}
                                                checked={q.reponse === "non"}
                                                onChange={() => handleQuestionChange(q.id, "non")}
                                            />
                                            Non
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="submit-btn">
                            Envoyer
                        </button>
                    </form>
                )}

                <h3>Témoignages approuvés</h3>
                {temoignages.length === 0 ? (
                    <p className="no-result">Aucun témoignage pour le moment.</p>
                ) : (
                    <ul className="temoignages-list">
                        {temoignages.map(t => (
                            <li key={t.id} className="temoignage">
                                <strong>{t.nom}</strong> - {new Date(t.date_creation).toLocaleDateString()}
                                <p>{t.message}</p>
                                {t.reponses && (
                                    <div className="reponses">
                                        <strong>Réponses au questionnaire:</strong>
                                        <ul>
                                            {(() => {
                                                try {
                                                    const reponses = typeof t.reponses === 'string' ? JSON.parse(t.reponses) : t.reponses;
                                                    if (!reponses || typeof reponses !== 'object') return null;
                                                    return Object.entries(reponses).map(([q, a]) => (
                                                        <li key={q}>
                                                            {q === "q1" ? "Le site est-il facile à utiliser ?" : "Recommanderiez-vous ce site à un ami ?"} : <strong>{a}</strong>
                                                        </li>
                                                    ));
                                                } catch (e) {
                                                    console.error("Erreur parsing reponses:", e);
                                                    return null;
                                                }
                                            })()}
                                        </ul>
                                    </div>
                                )}
                                {t.reponse && (
                                    <div className="reponse">
                                        <strong>Réponse de l’équipe:</strong> {t.reponse}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default LivreDor;
