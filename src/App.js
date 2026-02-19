import Navigation from './customer/Component/Navigation/Navigation';
import './App.css';
import HomePage from './customer/Pages/HomePage/HomePage';
import Product from './customer/Component/Product/Product';
import Footer from './customer/Component/Footer/Footer';
import ProductDetail from './customer/Component/ProductDetail/ProductDetail';
import Cart from './customer/Component/Cart/Cart';
import Checkout from './customer/Component/Checkout/Checkout';
import Order from './customer/Component/Order/Order';
import OrderDetails from './customer/Component/Order/OrderDetails';
import { Route, Routes } from 'react-router-dom';
import CustomerRouters from './customer/Routers/CustomerRouters';
import AdminRouters from './customer/Routers/AdminRouters';

function App() {
  return (
    <div className="App">

    <Routes>
      <Route path='/*' element={<CustomerRouters/>}></Route>
      <Route path='/admin/*' element={<AdminRouters/>}></Route>
    </Routes>
    </div>
  );
}

export default App;
