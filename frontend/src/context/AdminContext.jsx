import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true); // Added for loading state
  const [error, setError] = useState(null); // Added for error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Initialize from localStorage or mock data
        const savedBooks = localStorage.getItem("books");
        const savedOrders = localStorage.getItem("orders");
        const savedUsers = localStorage.getItem("users");
        const savedLogs = localStorage.getItem("activityLogs");

        // Books
        const initialBooks = savedBooks
          ? JSON.parse(savedBooks)
          : [
              {
                id: "1",
                title: "The Alchemist",
                author: "Paulo Coelho",
                price: "$9.99",
                genre: "Fiction",
                availability: "Available",
                language: "English",
                publicationDate: "1988-01-01", // Changed to publicationDate for Store.jsx
                cover: "https://example.com/alchemist-cover.jpg",
                backCover: "https://example.com/alchemist-back.jpg",
                description: "A magical story of following dreams.",
                type: "store",
              },
              {
                id: "2",
                title: "Sapiens",
                author: "Yuval Noah Harari",
                price: "$14.99",
                genre: "Non-Fiction",
                availability: "Checked Out",
                language: "English",
                publicationDate: "2011-02-01", // Changed to publicationDate
                cover: "https://example.com/sapiens-cover.jpg",
                backCover: "https://example.com/sapiens-back.jpg",
                description: "A brief history of humankind.",
                type: "library",
              },
            ];

        // Orders
        const initialOrders = savedOrders
          ? JSON.parse(savedOrders)
          : [
              { id: "1", user: "user1@example.com", bookId: "1", status: "Pending", date: "2025-09-01" },
              { id: "2", user: "user2@example.com", bookId: "2", status: "Approved", date: "2025-09-02" },
            ];

        // Users
        const initialUsers = savedUsers
          ? JSON.parse(savedUsers)
          : [
              { id: "1", email: "user1@example.com", status: "Active", borrowedBooks: [], orders: ["1"] },
              { id: "2", email: "user2@example.com", status: "Active", borrowedBooks: ["2"], orders: ["2"] },
            ];

        // Activity Logs
        const initialLogs = savedLogs
          ? JSON.parse(savedLogs)
          : [
              { id: "1", action: "Added book: The Alchemist", timestamp: "2025-09-01T10:00:00Z" },
              { id: "2", action: "Approved order 2", timestamp: "2025-09-02T12:00:00Z" },
            ];

        // Replace with actual API calls
        // Example: const response = await fetch("/api/books");
        // const booksData = await response.json();

        setBooks(initialBooks);
        setOrders(initialOrders);
        setUsers(initialUsers);
        setActivityLogs(initialLogs);
        setLoading(false);
      } catch (e) {
        setError("Failed to initialize data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("books", JSON.stringify(books));
      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("activityLogs", JSON.stringify(activityLogs));
    } catch (e) {
      setError("Failed to save to localStorage");
    }
  }, [books, orders, users, activityLogs]);

  const addBook = (book) => {
    const newBook = { id: `${Date.now()}`, ...book, type: book.type || "store", publicationDate: book.date || new Date().toISOString().split("T")[0] };
    setBooks([...books, newBook]);
    setActivityLogs([...activityLogs, { id: `${Date.now()}`, action: `Added book: ${book.title}`, timestamp: new Date().toISOString() }]);
  };

  const editBook = (id, updatedBook) => {
    setBooks(books.map((b) => (b.id === id ? { ...updatedBook, id, type: updatedBook.type || "store", publicationDate: updatedBook.date || b.publicationDate } : b)));
    setActivityLogs([...activityLogs, { id: `${Date.now()}`, action: `Edited book: ${updatedBook.title}`, timestamp: new Date().toISOString() }]);
  };

  const deleteBook = (id) => {
    const book = books.find((b) => b.id === id);
    setBooks(books.filter((b) => b.id !== id));
    setActivityLogs([...activityLogs, { id: `${Date.now()}`, action: `Deleted book: ${book?.title || "Unknown"}`, timestamp: new Date().toISOString() }]);
  };

  const approveOrder = (id) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "Approved" } : o)));
    setActivityLogs([...activityLogs, { id: `${Date.now()}`, action: `Approved order ${id}`, timestamp: new Date().toISOString() }]);
  };

  const declineOrder = (id) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "Declined" } : o)));
    setActivityLogs([...activityLogs, { id: `${Date.now()}`, action: `Declined order ${id}`, timestamp: new Date().toISOString() }]);
  };

  const suspendUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: "Suspended" } : u)));
    setActivityLogs([...activityLogs, { id: `${Date.now()}`, action: `Suspended user ${id}`, timestamp: new Date().toISOString() }]);
  };

  const unsuspendUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: "Active" } : u)));
    setActivityLogs([...activityLogs, { id: `${Date.now()}`, action: `Unsuspended user ${id}`, timestamp: new Date().toISOString() }]);
  };

  return (
    <AdminContext.Provider
      value={{
        books,
        orders,
        users,
        activityLogs,
        addBook,
        editBook,
        deleteBook,
        approveOrder,
        declineOrder,
        suspendUser,
        unsuspendUser,
        loading,
        error,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAdmin = () => useContext(AdminContext);

