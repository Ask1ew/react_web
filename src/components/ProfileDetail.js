import React, { useEffect, useState } from 'react';

function ProfileDetail() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        fetch('http://localhost:3001/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Non autorisé');
                return res.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/login';
            });
    }, []);

    const handleLogout = () => {
        if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login';
        }
    };

    if (loading) {
        return (
            <div className="form-box">
                <p>Chargement du profil...</p>
            </div>
        );
    }

    if (!user) return null;

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.prenom || '')}+${encodeURIComponent(user.nom || '')}&background=201244&color=fff`;

    return (
        <div className="form-box" style={{ marginTop: 40 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img
                    src={avatarUrl}
                    alt="Avatar utilisateur"
                    style={{ borderRadius: '50%', width: 80, height: 80, marginBottom: 12 }}
                />
                <h2 style={{ margin: 0 }}>Profil utilisateur</h2>
            </div>
            <div style={{ marginBottom: 24 }}>
                <p><strong>ID :</strong> {user.id}</p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Nom :</strong> {user.nom || '-'}</p>
                <p><strong>Prénom :</strong> {user.prenom || '-'}</p>
                <p><strong>Adresse :</strong> {user.adresse || '-'}</p>
                <p><strong>Téléphone :</strong> {user.telephone || '-'}</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Déconnexion
            </button>
        </div>
    );
}

export default ProfileDetail;
