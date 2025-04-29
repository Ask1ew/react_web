import React, { useState, useEffect } from 'react';

function LoginDetail() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/profile';
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
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
                setErrorMessage(errorText);
                throw new Error(errorText);
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            window.location.href = '/profile';
        } catch (error) {
            setErrorMessage('Identifiants incorrects. Veuillez réessayer.');
        }
    };

    return (
        <div>
            <h2>{isSignup ? 'Inscription' : 'Connexion'}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form
                className={isSignup ? 'inscription-form' : 'connexion-form'}
                onSubmit={handleSubmit}
            >
                <label htmlFor="email">Adresse e-mail :</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Entrez votre adresse e-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Mot de passe :</label>
                <input
                    type="password"
                    id="password"
                    placeholder={isSignup ? "Créez un mot de passe" : "Entrez votre mot de passe"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className={isSignup ? 'inscription-button' : 'connexion-button'}
                >
                    {isSignup ? "S'inscrire" : "Se connecter"}
                </button>
            </form>
            <p className="toggle-text">
                {isSignup ? 'Vous avez déjà un compte ?' : "Vous n'avez pas de compte ?"}
            </p>
            <button
                type="button"
                className="toggle-button"
                onClick={() => setIsSignup(!isSignup)}
            >
                {isSignup ? 'Se connecter' : "S'inscrire"}
            </button>
        </div>
    );
}

export default LoginDetail;
