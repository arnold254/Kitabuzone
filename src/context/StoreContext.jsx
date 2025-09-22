import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => setCart([...cart, book]);

  return (
    <StoreContext.Provider value={{ cart, addToCart }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);