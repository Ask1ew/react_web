import React, { useState, useEffect, useContext } from 'react';
import { PreferencesContext } from '../context/PreferencesContext';
import { useNavigate } from 'react-router-dom';
import '../styles/services.css';

// Génère la structure d'un mois (pour mini-agenda)
function generateMonthCalendar(year, month) {
    const weeks = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    let startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    while (startDate <= lastDay || startDate.getDay() !== 0) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push(new Date(startDate.getTime())); // Correction ici
            startDate.setDate(startDate.getDate() + 1);
        }
        weeks.push(week);
    }
    return weeks;
}

// Retourne la date au format YYYY-MM-DD
function formatDate(date) {
    // Retourne YYYY-MM-DD en local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function Agenda() {
    const { darkMode } = useContext(PreferencesContext);
    const [prestations, setPrestations] = useState([]);
    const [selectedPrestation, setSelectedPrestation] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
    const navigate = useNavigate();
    const [commentaire, setCommentaire] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/prestations')
            .then(res => res.json())
            .then(data => setPrestations(data));
    }, []);

    useEffect(() => {
        if (selectedPrestation) {
            setLoadingSlots(true);
            fetch(`http://localhost:3001/slots?prestationId=${selectedPrestation.id}`)
                .then(res => res.json())
                .then(data => {
                    setSlots(data);
                    setLoadingSlots(false);
                });
        } else {
            setSlots([]);
        }
    }, [selectedPrestation]);

    // Pour le mini-agenda
    const weeks = generateMonthCalendar(currentYear, currentMonth);

    // On veut pouvoir cliquer sur toutes les dates >= aujourd'hui
    const todayStr = formatDate(new Date());

    // Pour l'input date (filtre jour)
    const minDate = todayStr;
    const maxDate = slots.length > 0 ? slots[slots.length - 1].date : '';

    // Si aucune date sélectionnée, on propose aujourd'hui si dispo dans la plage
    useEffect(() => {
        if (!selectedDate && slots.length > 0) {
            setSelectedDate(todayStr);
        }
    }, [slots, selectedDate, todayStr]);

    // Créneaux du jour sélectionné (tous, disponibles ou non)
    const slotsForDay = selectedDate
        ? slots.filter(s => s.date === selectedDate)
        : [];

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const prevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handlePrestationChange = (e) => {
        const prestation = prestations.find(p => p.id === Number(e.target.value));
        setSelectedPrestation(prestation);
        setSelectedSlot(null);
        setSelectedDate('');
        setMessage('');
        setMessageType('');
    };

    const handleSlotSelect = (slot) => {
        if (!slot.disponible) return;
        setSelectedSlot(slot);
        setMessage('');
        setMessageType('');
    };

    const handleValidate = () => {
        if (!selectedSlot || !selectedSlot.disponible) return;
        fetch('http://localhost:3001/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({
                prestation_id: selectedPrestation.id,
                date_reservation: `${selectedSlot.date} ${selectedSlot.heure}`,
                commentaire: commentaire // ajout ici
            })
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok) {
                    setMessage("Votre réservation a bien été prise en compte !");
                    setMessageType('success');
                    setSelectedSlot(null);
                    setCommentaire('');
                } else {
                    setMessage(data.error || "Erreur lors de la réservation.");
                    setMessageType('error');
                }
            })
            .catch(() => {
                setMessage("Erreur réseau lors de la réservation.");
                setMessageType('error');
            });
    };

    return (
        <div className={`agenda ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Réserver une prestation</h2>
            <div className="agenda-prestation-select">
                <label htmlFor="prestation-select">Choisissez une prestation :</label>
                <select id="prestation-select" onChange={handlePrestationChange} value={selectedPrestation ? selectedPrestation.id : ''}>
                    <option value="">-- Sélectionner --</option>
                    {prestations.map(p => (
                        <option key={p.id} value={p.id}>{p.titre}</option>
                    ))}
                </select>
            </div>
            {/* Mini-agenda mensuel */}
            {selectedPrestation && (
                <div className="mini-calendar">
                    <div className="agenda-header">
                        <button onClick={prevMonth} aria-label="Mois précédent">&lt;</button>
                        <h3>{monthNames[currentMonth - 1]} {currentYear}</h3>
                        <button onClick={nextMonth} aria-label="Mois suivant">&gt;</button>
                    </div>
                    <table className="agenda-calendar">
                        <thead>
                        <tr>
                            <th>Dim</th>
                            <th>Lun</th>
                            <th>Mar</th>
                            <th>Mer</th>
                            <th>Jeu</th>
                            <th>Ven</th>
                            <th>Sam</th>
                        </tr>
                        </thead>
                        <tbody>
                        {weeks.map((week, i) => (
                            <tr key={i}>
                                {week.map((day, idx) => {
                                    const isCurrentMonth = day.getMonth() + 1 === currentMonth;
                                    const dayStr = formatDate(day);
                                    const isPast = dayStr < todayStr;
                                    return (
                                        <td
                                            key={idx}
                                            className={
                                                `${isCurrentMonth ? 'current-month' : 'other-month'} ` +
                                                `${selectedDate === dayStr ? 'selected-day' : ''}`
                                            }
                                            onClick={() => !isPast && setSelectedDate(dayStr)}
                                            style={{ cursor: !isPast ? 'pointer' : 'not-allowed', opacity: !isPast ? 1 : 0.4 }}
                                        >
                                            <div className="day-number">{isCurrentMonth ? day.getDate() : ''}</div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Filtre jour */}
            {selectedPrestation && (
                <div className="agenda-date-filter">
                    <label htmlFor="date-filter">Choisir un jour :</label>
                    <input
                        type="date"
                        id="date-filter"
                        value={selectedDate}
                        min={minDate}
                        max={maxDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        disabled={loadingSlots || slots.length === 0}
                    />
                </div>
            )}
            {/* Créneaux du jour sélectionné */}
            {selectedPrestation && selectedDate && (
                <div className="agenda-slots">
                    <h3>Créneaux pour le {selectedDate.split('-').reverse().join('/')}</h3>
                    {loadingSlots ? (
                        <p>Chargement des créneaux...</p>
                    ) : (
                        <ul className="slots-list">
                            {slotsForDay.length === 0 && <li>Aucun créneau pour ce jour.</li>}
                            {slotsForDay.map(slot => (
                                <li key={slot.date + slot.heure}>
                                    <button
                                        className={
                                            (selectedSlot && selectedSlot.date === slot.date && selectedSlot.heure === slot.heure ? 'selected ' : '') +
                                            (!slot.disponible ? 'disabled-slot' : '')
                                        }
                                        onClick={() => handleSlotSelect(slot)}
                                        disabled={!slot.disponible}
                                    >
                                        {slot.heure} {!slot.disponible && <span className="slot-indispo">indisponible</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <textarea
                        className="agenda-comment"
                        placeholder="Ajouter un commentaire (facultatif)"
                        value={commentaire}
                        onChange={e => setCommentaire(e.target.value)}
                        rows={2}
                        maxLength={250}
                    />
                    <button
                        className="validate-btn"
                        disabled={!selectedSlot || !selectedSlot.disponible}
                        onClick={() => setShowConfirm(true)}
                    >
                        Valider ce créneau
                    </button>
                    {message && (
                        <div className={`agenda-message ${messageType}`}>
                            {message}
                        </div>
                    )}
                </div>
            )}
            <button
                className="dashboard-btn"
                onClick={() => navigate('/profile')}
            >
                Accéder à mon tableau de bord
            </button>
            {showConfirm && (
                <div className="agenda-popup-overlay">
                    <div className="agenda-popup">
                        <h4>Confirmer la réservation</h4>
                        <p>
                            Confirmer la réservation du {selectedSlot.date.split('-').reverse().join('/')} à {selectedSlot.heure}
                            {commentaire && (<><br/><em>Commentaire&nbsp;: {commentaire}</em></>)}
                        </p>
                        <div className="agenda-popup-actions">
                            <button className="validate-btn" onClick={() => { setShowConfirm(false); handleValidate(); }}>
                                Confirmer
                            </button>
                            <button className="dashboard-btn" onClick={() => setShowConfirm(false)}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Agenda;
