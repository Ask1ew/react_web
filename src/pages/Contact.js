import React, { useState } from 'react';
import '../styles/contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        setSubmitted(true);
        // Réinitialiser le formulaire après soumission
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <div className="contact-page">
            <h1>Contactez-nous</h1>
            <p>Si vous avez des questions ou des commentaires, n'hésitez pas à nous contacter en remplissant le formulaire ci-dessous.</p>
            {submitted && <p className="success-message">Votre message a été envoyé avec succès !</p>}
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nom :</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message :</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="submit-button">Envoyer</button>
            </form>
        </div>
    );
}

export default Contact;
