import React, { useState, useEffect } from 'react';
function LoginDetail() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false); //

    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/profile';
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isSignup ? 'http://localhost:3001/signup' :
                'http://localhost:3001/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'    },
                body: JSON.stringify({ email, password })   });
            if (!response.ok) {
                const errorMessage = await response.text();
                setErrorMessage(errorMessage);
                throw new Error(errorMessage);   }
            const data = await response.json();
            const token = data.token;
            localStorage.setItem('token', token);
            const userId = data.userId;
            localStorage.setItem('userId', userId);

            window.location.href = '/profile';
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            setErrorMessage('Identifiants incorrects. Veuillez réessayer.');  } };
    return (
        <div>
            <h2>{isSignup ? 'Inscription' : 'Connexion'}</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) =>
                    setPassword(e.target.value)} />
                <button type="submit">{isSignup ? 'S\'inscrire' : 'Se connecter'}</button>
            </form>
            <p>{isSignup ? 'Vous avez déjà un compte ?' : 'Vous n\'avez pas de compte ?'}</p>
            <button onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Se connecter' : 'S\'inscrire'}</button>
        </div>
    );
}
export default LoginDetail;
