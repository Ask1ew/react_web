import '../styles/index.css';
import logo from '../assets/galactic_burgers_logo.jpg';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className='header'>
            <img src={logo} className='logo' alt="logo" />
            <div className='title'>
                <h1>Galactic Burgers</h1>
            </div>
            <nav className='nav-links'>
                <Link to="/" className="nav-button">Accueil</Link>
                <Link to="/menu" className="nav-button">Menu</Link>
                <Link to="/about" className="nav-button">À propos</Link>
                <Link to="/contact" className="nav-button">Contact</Link>
            </nav>
        </div>
    );
}

export default Header;
