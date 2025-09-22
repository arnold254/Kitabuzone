import { createContext, useContext, useState } from "react";

const BorrowContext = createContext();

export const BorrowProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [borrowed, setBorrowed] = useState([]);

  const addToCart = (book) => {
    if (!cart.find((item) => item.id === book.id)) {
      setCart([...cart, book]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((book) => book.id !== id));
  };

  const confirmBorrow = () => {
    setBorrowed([...borrowed, ...cart]);
    setCart([]);
  };

  return (
    <BorrowContext.Provider
      value={{ cart, borrowed, addToCart, removeFromCart, confirmBorrow }}
    >
      {children}
    </BorrowContext.Provider>
  );
};

export const useBorrow = () => useContext(BorrowContext);
