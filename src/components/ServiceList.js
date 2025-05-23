import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreferencesContext } from '../context/PreferencesContext';
import { DeviseContext } from '../context/DeviseContext';
import '../styles/services.css';

const DEVISE_SYMBOLS = { EUR: '€', USD: '$', GBP: '£' };
const DEVISE_RATES = { EUR: 1, USD: 1.1, GBP: 0.85 }; // exemple de taux

function ServiceList() {
    const { darkMode } = useContext(PreferencesContext);
    const { devise } = useContext(DeviseContext);
    const navigate = useNavigate();

    const [serviceList, setServiceList] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        category: 'all',
        available: 'all',
        minPrice: '',
        maxPrice: '',
        minDuration: '',
        maxDuration: ''
    });
    const [sort, setSort] = useState('default');

    // Récupération des prestations
    useEffect(() => {
        fetch('http://localhost:3001/prestations')
            .then(res => res.json())
            .then(data => setServiceList(data));
    }, []);

    useEffect(() => {
        let services = [...serviceList];

        // Recherche
        if (search.trim() !== '') {
            services = services.filter(service =>
                service.titre.toLowerCase().includes(search.toLowerCase()) ||
                (service.description && service.description.toLowerCase().includes(search.toLowerCase()))
            );
        }

        // Filtre par catégorie
        if (filters.category !== 'all') {
            services = services.filter(service => service.categorie === filters.category);
        }

        // Filtre par disponibilité
        if (filters.available !== 'all') {
            const dispoValue = filters.available === 'true' ? 1 : 0;
            services = services.filter(service => Number(service.disponible) === dispoValue);
        }

        // Filtre par prix
        if (filters.minPrice !== '') {
            services = services.filter(service => service.prix >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice !== '') {
            services = services.filter(service => service.prix <= parseFloat(filters.maxPrice));
        }

        // Filtre par durée
        if (filters.minDuration !== '') {
            services = services.filter(service => service.duree >= parseInt(filters.minDuration));
        }
        if (filters.maxDuration !== '') {
            services = services.filter(service => service.duree <= parseInt(filters.maxDuration));
        }

        // Tri
        if (sort === 'price-asc') {
            services.sort((a, b) => a.prix - b.prix);
        } else if (sort === 'price-desc') {
            services.sort((a, b) => b.prix - a.prix);
        } else if (sort === 'name-asc') {
            services.sort((a, b) => a.titre.localeCompare(b.titre));
        } else if (sort === 'name-desc') {
            services.sort((a, b) => b.titre.localeCompare(a.titre));
        } else if (sort === 'duration-asc') {
            services.sort((a, b) => a.duree - b.duree);
        } else if (sort === 'duration-desc') {
            services.sort((a, b) => b.duree - a.duree);
        }

        setFilteredServices(services);
    }, [serviceList, search, filters, sort]);

    const categories = ['all', ...Array.from(new Set(serviceList.map(service => service.categorie).filter(Boolean)))];

    const showDetails = (service) => {
        navigate('/detail', { state: { service } });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReset = () => {
        setSearch('');
        setFilters({
            category: 'all',
            available: 'all',
            minPrice: '',
            maxPrice: '',
            minDuration: '',
            maxDuration: ''
        });
        setSort('default');
    };

    // Conversion prix
    const convertPrice = (price) => {
        const rate = DEVISE_RATES[devise] || 1;
        return (price * rate).toFixed(2);
    };

    return (
        <div className={`shopping-list ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="Rechercher une prestation..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-input"
                />
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'Toutes catégories' : cat}</option>
                    ))}
                </select>
                <select
                    name="available"
                    value={filters.available}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="all">Toutes disponibilités</option>
                    <option value="true">Disponible</option>
                    <option value="false">Indisponible</option>
                </select>
                <div className="filter-group">
                    <label className="filter-label">Prix&nbsp;:</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="min"
                        className="filter-input-short"
                        min="0"
                    />
                    <span className="filter-sep">-</span>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="max"
                        className="filter-input-short"
                        min="0"
                    />
                </div>
                <div className="filter-group">
                    <label className="filter-label">Durée&nbsp;:</label>
                    <input
                        type="number"
                        name="minDuration"
                        value={filters.minDuration}
                        onChange={handleFilterChange}
                        placeholder="min"
                        className="filter-input-short"
                        min="0"
                    />
                    <span className="filter-sep">-</span>
                    <input
                        type="number"
                        name="maxDuration"
                        value={filters.maxDuration}
                        onChange={handleFilterChange}
                        placeholder="max"
                        className="filter-input-short"
                        min="0"
                    />
                    <span className="filter-unit">min</span>
                </div>
                <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="sort-select"
                >
                    <option value="default">Tri par défaut</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                    <option value="duration-asc">Durée croissante</option>
                    <option value="duration-desc">Durée décroissante</option>
                </select>
                <button className="reset-btn" onClick={handleReset}>Réinitialiser</button>
            </div>

            <ul className="item-list">
                {filteredServices.length === 0 ? (
                    <li className="no-result">Aucune prestation ne correspond à votre recherche ou vos filtres.</li>
                ) : (
                    filteredServices.map((service) => (
                        <li key={service.id} className={`services-item ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                            <div className="services-image">
                                <img src={service.image} alt={service.titre} />
                            </div>
                            <div className="services-main">
                                <h3 className="services-title">{service.titre}</h3>
                                <p className="services-description">{service.description}</p>
                                <div className="services-info-row">
                                    <div className="services-info-block">
                                        <span className="services-label">Prix </span>
                                        <span className="services-price">{convertPrice(service.prix)}{DEVISE_SYMBOLS[devise]}</span>
                                    </div>
                                    <div className="services-info-block">
                                        <span className="services-label">Durée </span>
                                        <span className="services-duree">{service.duree} min</span>
                                    </div>
                                </div>
                                <div className="services-info-row">
                                    <div className="services-info-block">
                                        <span className="services-label">Catégorie</span>
                                        <span className="services-categorie">{service.categorie}</span>
                                    </div>
                                    <div className="services-info-block">
                                        <span className="services-label">Disponibilité</span>
                                        <span className={`services-dispo ${service.disponible ? 'dispo-ok' : 'dispo-ko'}`}>
                    {service.disponible ? "Disponible" : "Indisponible"}
                </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className={`services-detail-btn ${darkMode ? 'dark-mode' : ''}`}
                                onClick={() => showDetails(service)}
                            >
                                Voir détail
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default ServiceList;
