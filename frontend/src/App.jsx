import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AddBook from './pages/AddBook'
import BookDetails from './pages/BookDetails'
import BorrowingCart from './pages/BorrowingCart'
import Library from './pages/Library'
import PaymentMethodCard from './pages/PaymentMethodCard'
import PaymentProcessing from './pages/PaymentProcessing'
import PaymentSuccessful from './pages/PaymentSuccessful'
import ShoppingCart from './pages/ShoppingCart'
import Store from './pages/Store'
import ViewBorrowedBooks from './pages/ViewBorrowedBooks'
import ViewOrders from './pages/ViewOrders'

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Store />} />
          <Route path="/addBook" element={<AddBook />} />
          <Route path="/bookDetails" element={<BookDetails />} />
          <Route path="/borrowingCart" element={<BorrowingCart />} />
          <Route path="/library" element={<Library />} />
          <Route path="/paymentMethodCard" element={<PaymentMethodCard />} />
          <Route path="/paymentProcessing" element={<PaymentProcessing />} />
          <Route path="/paymentSuccessful" element={<PaymentSuccessful />} />
          <Route path="/shoppingCart" element={<ShoppingCart />} />
          <Route path="/viewBorrowedBooks" element={<ViewBorrowedBooks />} />
          <Route path="/viewOrders" element={<ViewOrders />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
