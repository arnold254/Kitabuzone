import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import { BorrowProvider } from "./context/BorrowContext";

// admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageUsers from "./pages/admin/ManageUsers";
import SalesReports from "./pages/admin/SalesReports";
import LendingReports from "./pages/admin/LendingReports";
import ActivityLogs from "./pages/admin/ActivityLogs";

// auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// borrowing pages
import Library from "./pages/borrowing/Library";
import BorrowingCart from "./pages/borrowing/BorrowingCart";
import ViewBorrowedBooks from "./pages/borrowing/ViewBorrowedBooks";

function App() {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/admin");

  return (
    <BorrowProvider>
      {!hideHeader && <Header />} {/* Hide header on /admin */}
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="sales" element={<SalesReports />} />
          <Route path="lendings" element={<LendingReports />} />
          <Route path="activities" element={<ActivityLogs />} />
        </Route>

        {/* Borrowing Routes */}
        <Route path="/borrowing/library" element={<Library />} />
        <Route path="/borrowing/cart" element={<BorrowingCart />} />
        <Route path="/borrowing/view" element={<ViewBorrowedBooks />} />
      </Routes>
    </BorrowProvider>
  );
}

export default App;
