import React, { useEffect, useState } from 'react';

function ProfileDetail() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

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
                setForm({
                    nom: data.nom || '',
                    prenom: data.prenom || '',
                    email: data.email || '',
                    password: '',
                    adresse: data.adresse || '',
                    telephone: data.telephone || '',
                });
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/login';
            });
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setEditMode(true);
        setMessage('');
        setError('');
    };

    const handleCancel = () => {
        setEditMode(false);
        setMessage('');
        setError('');
        setForm(prev => ({
            nom: user.nom || '',
            prenom: user.prenom || '',
            email: user.email || '',
            password: '',
            adresse: user.adresse || '',
            telephone: user.telephone || '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setSaving(true);
        const token = localStorage.getItem('token');
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;

        try {
            const res = await fetch('http://localhost:3001/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur de mise à jour');

            setUser(data);
            setEditMode(false);
            setMessage('Profil mis à jour avec succès !');
            setForm(prev => ({ ...prev, password: '' }));
        } catch (err) {
            setError(err.message || 'Erreur lors de la mise à jour');
        }
        setSaving(false);
    };

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

    const avatarUrl = user.photo
        ? user.photo
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.prenom || '')}+${encodeURIComponent(user.nom || '')}&background=201244&color=fff`;

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
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            {editMode ? (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nom">Nom :</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                    />

                    <label htmlFor="prenom">Prénom :</label>
                    <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                    />

                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Mot de passe (laisser vide pour ne pas changer) :</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />

                    <label htmlFor="adresse">Adresse :</label>
                    <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        value={form.adresse}
                        onChange={handleChange}
                    />

                    <label htmlFor="telephone">Téléphone :</label>
                    <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={form.telephone}
                        onChange={handleChange}
                    />

                    <div className="button-group">
                        {!saving && <button type="submit">Enregistrer</button>}
                        <button type="button" onClick={handleCancel}>Annuler</button>
                    </div>
                </form>
            ) : (
                <>
                    <div style={{ marginBottom: 24 }}>
                        <p><strong>ID :</strong> {user.id}</p>
                        <p><strong>Email :</strong> {user.email}</p>
                        <p><strong>Nom :</strong> {user.nom || '-'}</p>
                        <p><strong>Prénom :</strong> {user.prenom || '-'}</p>
                        <p><strong>Adresse :</strong> {user.adresse || '-'}</p>
                        <p><strong>Téléphone :</strong> {user.telephone || '-'}</p>
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={handleEdit}>
                            Modifier le profil
                        </button>
                        <button type="button" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProfileDetail;
