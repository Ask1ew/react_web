import React, { useState, useEffect, useContext } from 'react';
import { PreferencesContext } from '../context/PreferencesContext';
import { useNavigate } from 'react-router-dom';
import '../styles/services.css';

function Agenda() {
    const { darkMode } = useContext(PreferencesContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-12
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setReservations([]);
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }
        setIsLoggedIn(true);
        fetch('http://localhost:3001/reservations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setReservations(data);
                setLoading(false);
            })
            .catch(() => {
                setReservations([]);
                setLoading(false);
            });
    }, []);

    // Génère la structure du mois en semaines
    const generateMonthCalendar = (year, month) => {
        const weeks = [];
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        let startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        while (startDate <= lastDay || startDate.getDay() !== 0) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(startDate));
                startDate.setDate(startDate.getDate() + 1);
            }
            weeks.push(week);
        }
        return weeks;
    };

    // Filtre les réservations du mois affiché
    const filterReservationsByMonth = (reservations, year, month) => {
        return reservations.filter(r => {
            const dt = new Date(r.date_reservation);
            return dt.getFullYear() === year && dt.getMonth() + 1 === month;
        });
    };

    // Groupe les réservations par jour
    const groupReservationsByDay = (reservations) => {
        const grouped = {};
        reservations.forEach(r => {
            const day = new Date(r.date_reservation).getDate();
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(r);
        });
        return grouped;
    };

    const weeks = generateMonthCalendar(currentYear, currentMonth);
    const monthReservations = filterReservationsByMonth(reservations, currentYear, currentMonth);
    const groupedReservations = groupReservationsByDay(monthReservations);

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

    if (!isLoggedIn) {
        return (
            <div className={`agenda ${darkMode ? 'dark-mode' : ''}`}>
                <p>Vous devez être connecté pour consulter votre agenda de réservations.</p>
                <button className="agenda-login-btn" onClick={() => navigate('/login')}>Se connecter</button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`agenda ${darkMode ? 'dark-mode' : ''}`}>
                <p>Chargement de l'agenda...</p>
            </div>
        );
    }

    return (
        <div className={`agenda ${darkMode ? 'dark-mode' : ''}`}>
            <div className="agenda-header">
                <button onClick={prevMonth} aria-label="Mois précédent">&lt;</button>
                <h2>{monthNames[currentMonth - 1]} {currentYear}</h2>
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
                            const dayNumber = day.getDate();
                            const dayReservations = isCurrentMonth ? (groupedReservations[dayNumber] || []) : [];
                            return (
                                <td key={idx} className={isCurrentMonth ? 'current-month' : 'other-month'}>
                                    <div className="day-number">{isCurrentMonth ? dayNumber : ''}</div>
                                    {dayReservations.map((r, idx) => (
                                        <div
                                            key={r.id}
                                            className={`reservation ${r.statut.replace(/\s/g, '-')}`}
                                            title={`${r.prestation_titre} - ${r.statut}`}
                                        >
                                            {idx + 1}
                                        </div>
                                    ))}

                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
            {monthReservations.length > 0 && (
                <div className="agenda-reservations-list">
                    <h3>Mes réservations ce mois-ci</h3>
                    <ul>
                        {monthReservations.map(r => (
                            <li key={r.id}>
                                <strong>{new Date(r.date_reservation).toLocaleDateString()} :</strong> {r.prestation_titre} <br/>— <em>{r.statut}</em>
                                {r.commentaire && <> —<br/> <span className="agenda-reservation-comment">{r.commentaire}</span></>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Agenda;
