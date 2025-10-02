// src/context/BorrowedBooksContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import API from "../api";

const BorrowedBooksContext = createContext();

export const BorrowedBooksProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's borrow requests
  const fetchRequests = async () => {
    try {
      setLoading(true);

      // get token from localStorage (assuming you save it at login)
      const token = localStorage.getItem("token");

      const res = await API.get("/pendingRequests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch borrow requests:", err);
      setError("Unauthorized. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <BorrowedBooksContext.Provider
      value={{ requests, setRequests, fetchRequests, loading, error }}
    >
      {children}
    </BorrowedBooksContext.Provider>
  );
};

export const useBorrowedBooks = () => useContext(BorrowedBooksContext);
