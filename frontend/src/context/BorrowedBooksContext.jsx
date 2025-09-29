// src/context/BorrowedBooksContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import API from "../api";

const BorrowedBooksContext = createContext();

export const BorrowedBooksProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);

  // Fetch user's borrow requests
  const fetchRequests = async () => {
    try {
      const res = await API.get("/pendingRequests");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch borrow requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <BorrowedBooksContext.Provider value={{ requests, setRequests, fetchRequests }}>
      {children}
    </BorrowedBooksContext.Provider>
  );
};

export const useBorrowedBooks = () => useContext(BorrowedBooksContext);
