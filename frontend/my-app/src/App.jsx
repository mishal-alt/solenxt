import Home from './page/Home';
import About from './page/About';
import Contact from './page/Contact';
import Product from './page/Product';
import Cart from './page/Cart';
import Wishlist from './page/Wishlist';
import Login from './page/Login';
import Signin from './page/Signin';
import Navbar from './comp/Nav';
import Payment from './page/Payment';
import Scrolltop from './comp/Scrolltop';
import Footer from './comp/Footer';
import Singleproduct from './page/Singlepro';
import Order from './page/Order';
import Productest from './page/Producttest';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//page --
import Dashboard from './admin/Dashboard';
import Adminroute from './admin/components/Privetadmin';
import ManageProducts from "./admin/ManageProducts";
import ManageUsers from "./admin/ManageUsers";
import Orders from "./admin/Orders";

//  Added layout wrapper to hide navbar/footer on admin routes
function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin'); // hide for admin

  return (
    <>
      {!hideLayout && <Navbar />}
      <Scrolltop />
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        {/* ✅ Wrap all routes inside LayoutWrapper */}
        <LayoutWrapper>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/product' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/footer' element={<Footer />} />
            <Route path="/product/:id" element={<Singleproduct />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order" element={<Order />} />
            <Route path="/protest" element={<Productest />} />

            {/* Admin routes */}
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/orders" element={<Orders />} />

            <Route
              path="/admin/dashboard"
              element={
                <Adminroute>
                  <Dashboard />
                </Adminroute>
              }
            />
          </Routes>
        </LayoutWrapper>

        {/* ToastContainer */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </>
  );
}

export default App;
