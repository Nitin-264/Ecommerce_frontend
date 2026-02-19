import { Route, Routes } from "react-router-dom";
import Navigation from "../Component/Navigation/Navigation";
import Footer from "../Component/Footer/Footer";
import HomePage from "../Pages/HomePage/HomePage";
import Product from "../Component/Product/Product";
import ProductDetail from "../Component/ProductDetail/ProductDetail";
import Cart from "../Component/Cart/Cart";
import Checkout from "../Component/Checkout/Checkout";
import Order from "../Component/Order/Order";
import OrderDetails from "../Component/Order/OrderDetails";
import PaymentSuccess from "../Component/Payment/PaymentSuccess";
import Profile from "../Component/Profile/Profile";

const CustomerRouters = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />

          {/* category routing */}
          <Route
            path="/:category/:section/:item"
            element={<Product />}
          />

          <Route
            path="/product/:productId"
            element={<ProductDetail />}
          />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/account/order" element={<Order />} />
          <Route path="/account/profile" element={<Profile />} />
          <Route
            path="/account/order/:orderId"
            element={<OrderDetails />}
          />

          <Route
            path="/payment/:orderId"
            element={<PaymentSuccess />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerRouters;
