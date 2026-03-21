import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import axios from 'axios';
import { API_URL } from '../config';
import { Package, User, MapPin, Clock, CheckCircle2, ShoppingBag, ArrowRight, Printer, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const { favorites, removeFavorite } = useFavorites();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/orders/user`);
            setOrders(data);
        } catch (e) {
            toast.error(t('Failed to load orders'));
        } finally {
            setLoading(false);
        }
    };

    const handlePrintAll = () => {
        window.print();
    };

    return (
        <div className="pt-28 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* User Profile Sidebar */}
                    <aside className="lg:w-1/4">
                        <div className="vibrant-card p-8 text-center overscroll-none border border-slate-700/50">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20">
                                <User size={48} />
                            </div>
                            <h2 className="text-2xl font-black mb-2 text-slate-100">{user?.name}</h2>
                            <p className="text-slate-400 font-medium mb-2">{user?.email}</p>
                            <p className="text-emerald-500/80 font-bold text-xs uppercase tracking-widest leading-relaxed">{t('Valued Pet Parent')}</p>

                            <div className="space-y-4 text-left mt-8">
                                <div className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-2xl flex items-center gap-4 border border-slate-700/50 shadow-sm">
                                    <MapPin size={20} className="text-emerald-500" />
                                    <div className="text-xs">
                                        <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">{t('Default Address')}</p>
                                        <p className="font-bold text-slate-200 line-clamp-1">{user?.address || t('No address saved.')}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-2xl flex items-center gap-4 border border-slate-700/50 shadow-sm">
                                    <Clock size={20} className="text-emerald-500" />
                                    <div className="text-xs">
                                        <p className="font-black text-slate-500 uppercase tracking-widest text-[10px]">{t('Member Since')}</p>
                                        <p className="font-bold text-slate-400">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="w-full mt-10 py-4 border-2 border-red-500/20 text-red-500 font-bold rounded-2xl hover:bg-red-500/10 transition-colors"
                            >
                                {t('Sign Out')}
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-3/4 space-y-8">
                        {/* Favorites Section */}
                        <div className="vibrant-card p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black flex items-center gap-4">
                                    <Heart className="text-red-500 fill-current" size={32} /> {t('My Favorites')}
                                </h2>
                            </div>

                            {favorites.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="bg-slate-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                                        <Heart size={32} className="text-slate-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-500 mb-8">{t('No favorites yet.')}</h3>
                                    <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                                        {t('Browse Pets')} <ArrowRight />
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favorites.map(favorite => (
                                        <div key={favorite._id} className="group vibrant-card p-6 card-hover relative">
                                            <button
                                                onClick={() => {
                                                    removeFavorite(favorite._id);
                                                    toast.success(`${t(favorite.name)} ${t('removed from favorites')}`, { icon: '❤️' });
                                                }}
                                                className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md p-2 rounded-full text-red-500 hover:bg-red-500/20 transition-all shadow-lg hover:scale-110 z-10 border border-slate-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <Link to={`/pet/${favorite._id}`}>
                                                <div className="relative mb-4 overflow-hidden rounded-[2rem] aspect-square">
                                                    <img 
                                                        src={favorite.images?.[0]} 
                                                        alt={t(favorite.name)} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    />
                                                </div>
                                                <h4 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-emerald-400 transition-colors text-slate-100">
                                                    {t(favorite.name)}
                                                </h4>
                                                <p className="text-slate-500 font-medium text-sm mb-2">{t(favorite.category)} • {t(favorite.breed)}</p>
                                                <p className="font-black text-emerald-400 text-lg">₹{favorite.price}</p>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Orders Section */}
                        <div className="vibrant-card p-10 min-h-[600px]">
                            <div className="flex justify-between items-center mb-10 no-print">
                                <h2 className="text-3xl font-black flex items-center gap-4 text-slate-100">
                                    <Package className="text-emerald-500" /> {t('My Orders History')}
                                </h2>
                                <button
                                    onClick={handlePrintAll}
                                    className="btn-outline flex items-center gap-2 px-6 py-2 text-sm"
                                >
                                    <Printer size={18} /> {t('Print History')}
                                </button>
                            </div>

                            {loading ? (
                                <div className="space-y-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 bg-slate-900/50 rounded-[2rem] animate-pulse border border-slate-800" />
                                    ))}
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="bg-slate-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                                        <ShoppingBag size={32} className="text-slate-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-500 mb-8">{t('No orders found yet.')}</h3>
                                    <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                                        {t('Browse Pets')} <ArrowRight />
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map(order => (
                                        <div key={order._id} className="group bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2.5rem] border border-slate-700/50 hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="bg-slate-950 p-4 rounded-2xl shadow-sm border border-slate-800 group-hover:border-emerald-500/20">
                                                        <Package className="text-emerald-500" size={32} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t('Order ID')}</p>
                                                        <h4 className="font-mono text-sm font-bold text-slate-100">#{order._id.slice(-10)}</h4>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-8">
                                                    <div className="text-center md:text-left">
                                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t('Status')}</p>
                                                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                            {t(order.orderStatus)}
                                                        </span>
                                                    </div>
                                                    <div className="text-center md:text-left">
                                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t('Date')}</p>
                                                        <p className="font-bold text-sm text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-center md:text-left">
                                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{t('Total')}</p>
                                                        <p className="text-lg font-black text-emerald-400">₹{order.totalAmount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 border-t border-slate-800 pt-6 flex justify-between items-center text-xs text-slate-500 font-medium">
                                                <div className="flex items-center gap-2">
                                                    {order.paymentStatus === 'Paid' ? (
                                                        <span className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase tracking-widest">
                                                            <CheckCircle2 size={14} /> {t('Payment Confirmed')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-500 font-bold uppercase tracking-widest">
                                                            {t('Payment')}: {t(order.paymentMethod)}
                                                        </span>
                                                    )}
                                                </div>
                                                <Link to={`/orders/${order._id}`} className="text-emerald-500 font-bold hover:underline">
                                                    {t('View Details')}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    .bg-gray-50 { background: white !important; }
                    .shadow-none { box-shadow: none !important; }
                    .pt-28 { padding-top: 0 !important; }
                }
            `}} />
        </div>
    );
};

export default Dashboard;
