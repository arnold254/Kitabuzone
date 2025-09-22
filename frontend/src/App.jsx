import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { BorrowProvider } from "./context/BorrowContext";
import { StoreProvider } from "./context/StoreContext";
import { AdminProvider } from "./context/AdminContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { MenuIcon, X } from "lucide-react";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageUsers from "./pages/admin/ManageUsers";
import SalesReports from "./pages/admin/SalesReports";
import LendingReports from "./pages/admin/LendingReports";
import ActivityLogs from "./pages/admin/ActivityLogs";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Borrowing pages
import Library from "./pages/borrowing/Library";
import BorrowingCart from "./pages/borrowing/BorrowingCart";
import ViewBorrowedBooks from "./pages/borrowing/ViewBorrowedBooks";
import BookBorrowDetails from "./pages/borrowing/BookBorrowDetails";

// Store pages
import Store from "./pages/store/Store";
import AddBook from "./pages/store/AddBook";
import BookDetails from "./pages/store/BookDetails";
import PaymentMethodCard from "./pages/store/PaymentMethodCard";
import PaymentMethodEwallet from "./pages/store/PaymentMethodEwallet";
import PaymentMethodMpesa from "./pages/store/PaymentMethodMpesa";
import PaymentProcessing from "./pages/store/PaymentProcessing";
import PaymentSuccessful from "./pages/store/PaymentSuccessful";
import ViewOrders from "./pages/store/ViewOrders";
import ShoppingCart from "./pages/store/ShoppingCart";

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <ErrorBoundary fallback={<div className="text-center p-6 text-red-600">Something went wrong. Please try again later.</div>}>
      <AuthProvider>
        <BorrowProvider>
          <StoreProvider>
            <AdminProvider>
              <div className="flex flex-col min-h-screen">
                {isHomePage && <Header />}
                <div className="flex flex-1">
                  {!isAuthPage && !isHomePage && (
                    <>
                      {isSidebarOpen && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
                          onClick={() => setIsSidebarOpen(false)}
                        />
                      )}
                      <aside
                        className={`bg-gray-50 text-purple-900 w-32 p-1.5 h-screen fixed top-0 left-0 mt-12 transition-transform ${
                          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } md:translate-x-0 z-20 border-l border-purple-200`}
                      >
                        <Sidebar />
                      </aside>
                    </>
                  )}
                  <div className={`flex-1 ${!isHomePage ? "md:ml-32 mt-12" : ""}`}>
                    {!isHomePage && !isAuthPage && (
                      <button
                        className="md:hidden p-2 bg-purple-700 text-white fixed top-2 left-2 z-30"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                      </button>
                    )}
                    <main className="p-4">
                      <Routes>
                        {/* Auth Routes */}
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/signup" element={<Signup />} />
                        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                        <Route path="/auth/reset-password" element={<ResetPassword />} />

                        {/* Admin Routes */}
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute requireAdmin>
                              <AdminLayout />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<Dashboard />} />
                          <Route path="books" element={<ManageBooks />} />
                          <Route path="users" element={<ManageUsers />} />
                          <Route path="sales" element={<SalesReports />} />
                          <Route path="lendings" element={<LendingReports />} />
                          <Route path="activities" element={<ActivityLogs />} />
                        </Route>

                        {/* Public Routes */}
                        <Route path="/" element={<Store />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/addBook" element={<AddBook />} />
                        <Route path="/bookDetails/:id" element={<BookDetails />} />
                        <Route path="/borrowing/bookDetails/:id" element={<BookBorrowDetails />} />

                        {/* Protected Routes */}
                        <Route path="/borrowing/cart" element={<ProtectedRoute><BorrowingCart /></ProtectedRoute>} />
                        <Route path="/borrowing/view" element={<ProtectedRoute><ViewBorrowedBooks /></ProtectedRoute>} />
                        <Route path="/paymentMethodCard" element={<ProtectedRoute><PaymentMethodCard /></ProtectedRoute>} />
                        <Route path="/paymentMethodEwallet" element={<ProtectedRoute><PaymentMethodEwallet /></ProtectedRoute>} />
                        <Route path="/paymentMethodMpesa" element={<ProtectedRoute><PaymentMethodMpesa /></ProtectedRoute>} />
                        <Route path="/paymentProcessing" element={<ProtectedRoute><PaymentProcessing /></ProtectedRoute>} />
                        <Route path="/paymentSuccessful" element={<ProtectedRoute><PaymentSuccessful /></ProtectedRoute>} />
                        <Route path="/shoppingCart" element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
                        <Route path="/viewOrders" element={<ProtectedRoute><ViewOrders /></ProtectedRoute>} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </div>
            </AdminProvider>
          </StoreProvider>
        </BorrowProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;