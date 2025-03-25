import React from 'react';
import '../styles/index.css';
import { itemList } from "../datas/itemList";
import Item from "./Item";
import { useNavigate } from 'react-router-dom';

function ShoppingList({ addToCart }) {

    const navigate = useNavigate();

    const showDetails = (item) => {
        navigate('/detail', { state: { selectedItem: item } });
    };

    const calculateDiscountedPrice = (price, onSale) => {
        return onSale ? price / 2 : price;
    };

    return (
        <div className="shopping-list">
            <ul className='item-list'>
                {itemList.map((item) => (
                    <li key={item.id} className="item">
                        <div className="info-icon" onClick={() => showDetails(item)}>i</div>
                        <div className={`price-tag ${item.onSale ? 'on-sale' : ''}`}>
                            {calculateDiscountedPrice(item.price, item.onSale).toFixed(2)}€
                            {item.onSale && <div className="sale-label">solde</div>}
                        </div>
                        <Item
                            image={item.image}
                            name={item.name}
                        />
                        <button onClick={() => addToCart(item)}>Ajouter</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ShoppingList;
