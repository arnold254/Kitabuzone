import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("storeCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [dateSort, setDateSort] = useState("newest");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("storeCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    searchQuery,
    setSearchQuery,
    genreFilter,
    setGenreFilter,
    availabilityFilter,
    setAvailabilityFilter,
    languageFilter,
    setLanguageFilter,
    dateSort,
    setDateSort,
    priceFilter,
    setPriceFilter,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export default StoreProvider;