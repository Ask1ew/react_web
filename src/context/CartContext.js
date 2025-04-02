import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext({
    cartItems: {},
    addToCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {}
});

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : {};
    });

    const addToCart = (item) => {
        setCartItems(prev => ({
            ...prev,
            [item.id]: {
                ...item,
                count: prev[item.id]?.count ? prev[item.id].count + 1 : 1
            }
        }));
    };

    const updateQuantity = (itemId, newCount) => {
        setCartItems(prev => {
            const updated = { ...prev };
            if(newCount > 0) {
                updated[itemId].count = newCount;
            } else {
                delete updated[itemId];
            }
            return updated;
        });
    };

    const clearCart = () => setCartItems({});

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
