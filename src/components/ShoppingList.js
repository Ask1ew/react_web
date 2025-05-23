import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PreferencesContext } from '../context/PreferencesContext';
import { DeviseContext } from '../context/DeviseContext';
import Item from "./Item";
import '../styles/products.css';

const DEVISE_SYMBOLS = { EUR: '€', USD: '$', GBP: '£' };
const DEVISE_RATES = { EUR: 1, USD: 1.1, GBP: 0.85 };

function ShoppingList() {
    const { addToCart } = useCart();
    const { darkMode } = useContext(PreferencesContext);
    const { devise } = useContext(DeviseContext);
    const navigate = useNavigate();

    const [itemList, setItemsList] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        onSale: false,
        category: 'all'
    });
    const [sort, setSort] = useState('default');

    useEffect(() => {
        fetch('http://localhost:3001/')
            .then(res => res.json())
            .then(data => setItemsList(data));
    }, []);

    useEffect(() => {
        let items = [...itemList];

        if (search.trim() !== '') {
            items = items.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filters.onSale) {
            items = items.filter(item => item.onSale && item.onSale > 0 && item.onSale < 100);
        }

        if (filters.category !== 'all') {
            items = items.filter(item => item.category === filters.category);
        }

        if (sort === 'price-asc') {
            items.sort((a, b) => {
                const aFinal = a.onSale > 0 && a.onSale < 100 ? a.price * (1 - a.onSale / 100) : a.price;
                const bFinal = b.onSale > 0 && b.onSale < 100 ? b.price * (1 - b.onSale / 100) : b.price;
                return aFinal - bFinal;
            });
        } else if (sort === 'price-desc') {
            items.sort((a, b) => {
                const aFinal = a.onSale > 0 && a.onSale < 100 ? a.price * (1 - a.onSale / 100) : a.price;
                const bFinal = b.onSale > 0 && b.onSale < 100 ? b.price * (1 - b.onSale / 100) : b.price;
                return bFinal - aFinal;
            });
        } else if (sort === 'name-asc') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'name-desc') {
            items.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredItems(items);
    }, [itemList, search, filters, sort]);

    const categories = ['all', ...Array.from(new Set(itemList.map(item => item.category).filter(Boolean)))];

    const showDetails = (item) => {
        navigate('/detail', { state: { item } });
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleReset = () => {
        setSearch('');
        setFilters({ onSale: false, category: 'all' });
        setSort('default');
    };

    const convertPrice = (price) => {
        const rate = DEVISE_RATES[devise] || 1;
        return (price * rate).toFixed(2);
    };

    return (
        <div className={`shopping-list ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="Rechercher un article..."
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
                <label className="filter-checkbox">
                    <input
                        type="checkbox"
                        name="onSale"
                        checked={filters.onSale}
                        onChange={handleFilterChange}
                    />
                    En solde
                </label>
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
                </select>
                <button className="reset-btn" onClick={handleReset}>Réinitialiser</button>
            </div>

            <ul className="item-list">
                {filteredItems.length === 0 ? (
                    <li className="no-result">Aucun article ne correspond à votre recherche ou vos filtres.</li>
                ) : (
                    filteredItems.map((item) => {
                        const reduction = (item.onSale > 0 && item.onSale < 100) ? item.onSale : 0;
                        const priceOriginal = Number(convertPrice(item.price));
                        const priceFinal = reduction
                            ? Number(convertPrice(item.price * (1 - reduction / 100)))
                            : priceOriginal;

                        return (
                            <li key={item.id} className={`item ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                                <div className={`info-icon ${darkMode ? 'dark-mode' : ''}`} onClick={() => showDetails(item)}>i</div>
                                <div className={`price-tag ${darkMode ? 'dark-mode' : ''} ${reduction ? 'on-sale' : ''}`}>
                                    {reduction ? (
                                        <>
                                            <span className="old-price">
                                                <del>{priceOriginal.toFixed(2)}{DEVISE_SYMBOLS[devise]}</del>
                                            </span>
                                            <span className="new-price">
                                                {priceFinal.toFixed(2)}{DEVISE_SYMBOLS[devise]}
                                            </span>
                                            <span className="discount-badge">-{reduction}%</span>
                                        </>
                                    ) : (
                                        <span className="new-price">
                                            {priceOriginal.toFixed(2)}{DEVISE_SYMBOLS[devise]}
                                        </span>
                                    )}
                                </div>
                                <Item image={item.image} name={item.name} />
                                <button className={`${darkMode ? 'dark-mode' : ''}`} onClick={() => addToCart(item)}>Ajouter</button>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}

export default ShoppingList;
