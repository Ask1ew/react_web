import '../styles/item.css'

function Item(props) {
    const imageValue = props.image
    const nameValue = props.name
    const priceValue = props.price
    return (
        <div>
            <img className="img" src={imageValue} alt={nameValue}/>
            <p>
            {nameValue}<br/>
            {priceValue}€</p>
        </div>
    )
}
export default Item