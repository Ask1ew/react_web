import '../styles/item.css';

function Item(props) {
    return (
        <div>
            <img className="img" src={props.image} alt={props.name}/>
            <p>{props.name}</p>
        </div>
    );
}
export default Item;