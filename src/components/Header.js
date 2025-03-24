import '../styles/index.css';
import logo from '../assets/galactic_burgers_logo.jpg';

function Header() {
    const navigateTo = (path) => {
        window.location.href = path;
    };

    return (
        <div className='header'>
            <img src={logo} className='logo' alt="logo" />
            <div className='title'>
                <h1>Galactic Burgers</h1>
            </div>
            <nav className='nav-links'>
                <button className="nav-button" onClick={() => navigateTo('/')}>
                    Accueil
                </button>
                <button className="nav-button" onClick={() => navigateTo('/menu')}>
                    Menu
                </button>
                <button className="nav-button" onClick={() => navigateTo('/about')}>
                    À propos
                </button>
                <button className="nav-button" onClick={() => navigateTo('/contact')}>
                    Contact
                </button>
            </nav>
        </div>
    );
}

export default Header;
