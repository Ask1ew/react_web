import React, { useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileDetail from '../components/ProfileDetail';
import { PreferencesContext } from '../context/PreferencesContext';
import '../styles/login.css';
import Dashboard from "../components/Dashboard";
import LitigeDetail from "../components/LitigeDetail";
import CommandeDetail from "../components/CommandeDetail";
import ProfileAvis from "../components/ProfileAvis";

function Profile() {
    const { darkMode } = useContext(PreferencesContext);

    return (
        <div className={`connexion-root ${darkMode ? "dark-mode" : "light-mode"}`}>
            <Header />
            <div className="connexion-inscription-page">
                <div className={`profile-main-block${darkMode ? " dark-mode" : ""}`}>
                    <div className="profile-columns">
                        <div className="profile-left">
                            <ProfileDetail />
                            <ProfileAvis/>
                            <hr className="profile-separator" />
                            <LitigeDetail />
                        </div>
                        <div className="profile-right">
                            <Dashboard />
                            <CommandeDetail/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
