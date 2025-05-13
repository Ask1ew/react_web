// src/components/LoginDetail.js
import React, { useState, useEffect } from 'react';

function useRedirectIfAuthenticated() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/profile';
        }
    }, []);
}

function validateEmail(email) {
    // Simple regex for demonstration
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function LoginDetail() {
    useRedirectIfAuthenticated();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Validation côté client
        if (!validateEmail(email)) {
            setErrorMessage("Adresse e-mail invalide.");
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setLoading(true);

        try {
            const url = isSignup
                ? 'http://localhost:3001/signup'
                : 'http://localhost:3001/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrorMessage(errorText || "Erreur lors de la connexion/inscription.");
                setPassword('');
                setLoading(false);
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            window.location.href = '/profile';
        } catch (error) {
            setErrorMessage('Erreur réseau. Veuillez réessayer.');
            setPassword('');
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>{isSignup ? 'Inscription' : 'Connexion'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form
                className={isSignup ? 'inscription-form' : 'connexion-form'}
                onSubmit={handleSubmit}
                autoComplete="on"
            >
                <label htmlFor="email">Adresse e-mail :</label>
                <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    placeholder="Entrez votre adresse e-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    aria-label="Adresse e-mail"
                />

                <label htmlFor="password">Mot de passe :</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        placeholder={isSignup ? "Créez un mot de passe" : "Entrez votre mot de passe"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                        aria-label="Mot de passe"
                    />
                    <button
                        type="button"
                        className="show-password-btn"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <button
                    type="submit"
                    className={isSignup ? 'inscription-button' : 'connexion-button'}
                    disabled={loading}
                >
                    {loading ? 'Chargement...' : isSignup ? "S'inscrire" : "Se connecter"}
                </button>
            </form>
            <p className="toggle-text">
                {isSignup ? 'Vous avez déjà un compte ?' : "Vous n'avez pas de compte ?"}
            </p>
            <button
                type="button"
                className="toggle-button"
                onClick={() => {
                    setIsSignup(!isSignup);
                    setErrorMessage('');
                    setPassword('');
                }}
                disabled={loading}
            >
                {isSignup ? 'Se connecter' : "S'inscrire"}
            </button>
        </div>
    );
}

export default LoginDetail;
