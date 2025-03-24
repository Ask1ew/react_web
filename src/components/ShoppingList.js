import '../styles/index.css';
import { itemList } from "../datas/itemList";
import Item from "./Item";

function ShoppingList() {
    return (
        <div className="shopping-list">
            <ul className='item-list'>
                {itemList.map((item) => (
                    <li className="item">
                        {item.onSale && <div className='sales'>Soldes</div>}
                        <Item
                            image={item.image}
                            name={item.name}
                            price={item.price}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ShoppingList;