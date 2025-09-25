// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Store from "./pages/Store";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ResetPassword from "./pages/auth/ResetPassword";
import Library from "./pages/Library";
import BorrowingCart from "./pages/BorrowingCart";
import ViewBorrowedBooks from "./pages/ViewBorrowedBooks";
import LibraryBookDetail from "./pages/BookDetail";
import StoreBookDetail from "./pages/BookDetails";

// Payment pages
import PaymentMethodCard from "./pages/PaymentMethodCard";
import PaymentProcessing from "./pages/PaymentProcessing";
import PaymentSuccessful from "./pages/PaymentSuccessful";
import ShoppingCart from "./pages/ShoppingCart";
import ViewOrders from "./pages/ViewOrders";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageUsers from "./pages/admin/ManageUsers";
import ActivityLogs from "./pages/admin/ActivityLogs";
import BorrowingReport from "./pages/admin/BorrowingReport";
import SalesReport from "./pages/admin/SalesReport";

function AppWrapper() {
  const location = useLocation();
  const showHeader = location.pathname === "/"; // only show header on home

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Store / Homepage */}
        <Route path="/" element={<Store />} />

        {/* Auth pages */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/reset" element={<ResetPassword />} />

        {/* Library and Borrowing */}
        <Route path="/library" element={<Library />} />
        <Route path="/bookDetails/:id" element={<LibraryBookDetail />} />
        <Route path="/purchases/:id" element={<StoreBookDetail />} />
        <Route path="/borrowingCart" element={<BorrowingCart />} />
        <Route path="/viewBorrowedBooks" element={<ViewBorrowedBooks />} />

        {/* Shopping & Payment Flow */}
        <Route path="/shoppingCart" element={<ShoppingCart />} />
        <Route path="/viewOrders" element={<ViewOrders />} />
        <Route path="/payment/card" element={<PaymentMethodCard />} />
        <Route path="/payment/processing" element={<PaymentProcessing />} />
        <Route path="/payment/success" element={<PaymentSuccessful />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="managebooks" element={<ManageBooks />} />
          <Route path="manageusers" element={<ManageUsers />} />
          <Route path="activitylogs" element={<ActivityLogs />} />
          <Route path="borrowingreport" element={<BorrowingReport />} />
          <Route path="salesreport" element={<SalesReport />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
