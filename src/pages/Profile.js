import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileDetail from '../components/ProfileDetail';
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/login.css';

function Profile() {
    const { darkMode } = useContext(PreferencesContext);

    return (
        <div className={`connexion-root ${darkMode ? "dark-mode" : "light-mode"}`}>
            <Header />
            <div className="connexion-inscription-page">
                <div className="form-container">
                    <div className="form-box">
                        <ProfileDetail />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
