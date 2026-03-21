import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useTranslation } from 'react-i18next';
import { getPetImageUrl } from '../utils/imageUtils';

const Cart = () => {
    const { t } = useTranslation();
    const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            toast.error(t('Please login to checkout'));
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="pt-40 pb-20 text-center px-4">
                <div className="vibrant-card p-16 max-w-2xl mx-auto">
                    <div className="bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-500/20">
                        <ShoppingBag className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h2 className="text-4xl font-black mb-6 text-slate-100">{t('Your cart is empty')}</h2>
                    <p className="text-slate-400 text-lg mb-10 font-medium">{t('Looks like you haven\'t added any exotic pets to your collection yet.')}</p>
                    <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                        {t('Explore Pets')} <ArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black mb-12 text-slate-100 tracking-tight">{t('Your Shopping Cart')}</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 space-y-6">
                        {cartItems.map(item => (
                            <div key={item._id} className="vibrant-card p-6 flex items-center gap-8 group card-hover">
                                <img src={getPetImageUrl(item.images[0])} alt={t(item.name)} className="w-32 h-32 rounded-3xl object-cover ring-4 ring-slate-800 shadow-xl" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold uppercase tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors">{t(item.name)}</h3>
                                        <button onClick={() => removeFromCart(item._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm mb-6 uppercase tracking-widest">{t(item.category)} • {t(item.breed)}</p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-2xl border border-slate-700">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="p-2 hover:bg-slate-800 rounded-xl shadow-sm transition-all text-slate-400"
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="font-bold text-lg w-8 text-center text-slate-100">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="p-2 hover:bg-slate-800 rounded-xl shadow-sm transition-all text-slate-400"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <p className="text-xl font-black text-emerald-400">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:w-1/3">
                        <div className="vibrant-card p-10 sticky top-28">
                            <h2 className="text-2xl font-bold mb-8 text-slate-100">{t('Order Summary')}</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>{t('Subtotal')}</span>
                                    <span className="text-slate-100 font-bold">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>{t('Shipping')}</span>
                                    <span className="text-emerald-500 font-black uppercase text-xs tracking-widest mt-1">{t('Free')}</span>
                                </div>
                                <div className="border-t border-dashed border-slate-700 pt-4 flex justify-between">
                                    <span className="text-lg font-bold text-slate-200">{t('Total')}</span>
                                    <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">₹{subtotal}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3"
                            >
                                {t('Proceed to Checkout')} <ArrowRight />
                            </button>
                            <div className="mt-8 flex items-center justify-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> {t('Secure & Encrypted Transaction')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
