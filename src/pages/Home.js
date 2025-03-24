import Header from "../components/Header";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import ShoppingList from "../components/ShoppingList";

function Home() {
    return (
        <div>
            <Header />
            <div className="main-content">
                <div className="container">
                    <Cart />
                    <div className="content">
                        <ShoppingList />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;
