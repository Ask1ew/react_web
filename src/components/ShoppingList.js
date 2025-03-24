import React from 'react';
import '../styles/index.css';
import { itemList } from "../datas/itemList";
import Item from "./Item";

function ShoppingList({ addToCart }) {
    return (
        <div className="shopping-list">
            <ul className='item-list'>
                {itemList.map((item) => (
                    <li key={item.id} className="item">
                        <div className="price-tag">{item.price}€</div>
                        {item.onSale && <div className='sales'>Soldes</div>}
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
