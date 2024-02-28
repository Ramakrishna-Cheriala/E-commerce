import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/auth";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoutes from "./components/Routes/Private";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminRoutes from "./components/Routes/AdminRoutes";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import AllProduct from "./pages/Admin/AllProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";

import AdminMenu from "./components/Layout/AdminMenu";
import ProductById from "./pages/Admin/ProductById";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/user/Cart";
import Payment from "./pages/user/Payment";
import AdminOrders from "./pages/Admin/AdminOrders";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <ToastContainer />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product-details/:id" element={<ProductDetails />} />

              <Route path="/dashboard/*" element={<PrivateRoutes />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="cart" element={<Cart />} />
                <Route path="payment" element={<Payment />} />
              </Route>

              <Route path="/admindashboard/*" element={<AdminRoutes />}>
                <Route index element={<AdminDashboard />} />
                <Route path="create-category" element={<CreateCategory />} />
                <Route path="create-product" element={<CreateProduct />} />
                <Route path="all-product" element={<AllProduct />} />
                <Route path="product-details/:id" element={<ProductById />} />
                <Route path="users" element={<Users />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>

              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forget-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
