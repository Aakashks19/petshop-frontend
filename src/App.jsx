import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import OrderDetails from './pages/OrderDetails';
import PetDetails from './pages/PetDetails';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

import { PawPrint, Cat, Dog, Bird, Rabbit } from 'lucide-react';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <div className="flex flex-col min-h-screen pastel-bg relative overflow-x-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
              <PawPrint className="absolute top-[10%] left-[5%] text-primary-200 w-24 h-24 animate-float" style={{ animationDelay: '0s' }} />
              <Cat className="absolute top-[40%] left-[12%] text-accent-200 w-32 h-32 animate-float" style={{ animationDelay: '2s' }} />
              <Dog className="absolute bottom-[15%] left-[8%] text-blue-200 w-40 h-40 animate-float" style={{ animationDelay: '4s' }} />
              <Bird className="absolute top-[15%] right-[10%] text-purple-200 w-28 h-28 animate-float" style={{ animationDelay: '1s' }} />
              <Rabbit className="absolute bottom-[30%] right-[15%] text-green-200 w-36 h-36 animate-float" style={{ animationDelay: '3s' }} />
              <PawPrint className="absolute bottom-[5%] right-[5%] text-orange-200 w-20 h-20 animate-float" style={{ animationDelay: '5s' }} />

              {/* Additional Decorative Elements */}
              <div className="absolute top-[25%] left-[40%] w-4 h-4 bg-primary-300 rounded-full animate-float opacity-30" style={{ animationDelay: '1.5s' }} />
              <div className="absolute top-[70%] right-[45%] w-6 h-6 bg-accent-300 rounded-full animate-float opacity-30" style={{ animationDelay: '2.5s' }} />
              <div className="absolute bottom-[35%] right-[15%] w-3 h-3 bg-primary-400 rounded-full animate-float opacity-20" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-[55%] left-[15%] w-5 h-5 bg-primary-200 rounded-full animate-float opacity-20" style={{ animationDelay: '3.5s' }} />

              {/* Additional Abstract Shapes */}
              <div className="absolute top-[60%] right-[2%] w-64 h-64 bg-yellow-100 rounded-full blur-[100px] animate-mesh" />
              <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-pink-100 rounded-full blur-[120px] animate-mesh" style={{ animationDelay: '2s' }} />
            </div>

            <Navbar />
            <main className="flex-grow relative z-10 transition-all duration-500">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/pet/:id" element={<PetDetails />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="bottom-center" />
            </div>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
