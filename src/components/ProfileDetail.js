import React from 'react';

function ProfileDetail() {
    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    };

    return (
        <div>
            <h2>Profil utilisateur</h2>
            <p><strong>ID de l'utilisateur :</strong> {userId}</p>
            {/* Ici, tu pourras ajouter d'autres infos du profil plus tard */}
            <button className="logout-button" onClick={handleLogout}>
                Déconnexion
            </button>
        </div>
    );
}

export default ProfileDetail;
