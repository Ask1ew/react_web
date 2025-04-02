import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useCart} from '../context/CartContext';
import Item from "./Item";
import '../styles/index.css';

function ShoppingList() {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [itemList, setItemsList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/')
            .then(res => res.json())
            .then(data => setItemsList(data));
    }, []);

    const showDetails = (item) => {
        navigate('/detail', { state: { item } });
    };

    return (
        <div className="shopping-list">
            <ul className='item-list'>
                {itemList.map(item => (
                    <li key={item.id} className="item">
                        <div className="info-icon" onClick={() => showDetails(item)}>i</div>
                        <div className={`price-tag ${item.onSale ? 'on-sale' : ''}`}>
                            {item.onSale ? (
                                <>
                                    {(item.price / 2).toFixed(2)}€
                                    <div className="sale-label">solde</div>
                                </>
                            ) : `${item.price.toFixed(2)}€`}
                        </div>
                        <Item image={item.image} name={item.name} />
                        <button onClick={() => addToCart(item)}>Ajouter</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShoppingList;
