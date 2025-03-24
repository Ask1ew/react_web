import '../styles/item.css'

function Item(props) {
    const imageValue = props.image
    const nameValue = props.name
    return (
        <div>
            <img className="img" src={imageValue} alt={nameValue}/>
            <p>
            {nameValue}<br/>
            </p>
        </div>
    )
}
export default Item