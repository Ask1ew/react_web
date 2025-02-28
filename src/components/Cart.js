
function Cart(){
    const Articles = [
    {Nom: "T-shirt", Prix: 8},
    {Nom: "Pull", Prix: 10},
    {Nom: "Pantalon", Prix: 15}
    ];

    return (
        <div className="Cart">
            <h1>Panier</h1>
            <ul>
                {Articles.map((article, index) => (
                    <li key={index}>{article.Nom} : {article.Prix}€</li>
                ))}
            </ul>
            <p>
                Total : {Articles.reduce((total, article) => total + article.Prix, 0)}€
            </p>
            <button className="button">Vider le panier</button>
        </div>
    )

}

export default Cart;