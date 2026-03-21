import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Search, Filter, ShoppingCart, Info, Check, Zap, ArrowUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useTranslation } from 'react-i18next';
import { getPetImageUrl } from '../utils/imageUtils';

const Shop = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Derived state from URL parameters
    const categoryQuery = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';
    const minPriceQuery = searchParams.get('minPrice') || '';
    const maxPriceQuery = searchParams.get('maxPrice') || '';
    const sortQuery = searchParams.get('sort') || '';

    // Local state for immediate input feedback (synchronized back to URL)
    const [searchTerm, setSearchTerm] = useState(searchQuery);

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        setSearchTerm(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        fetchPets();
    }, [categoryQuery, searchQuery, minPriceQuery, maxPriceQuery, sortQuery]);

    const fetchPets = async () => {
        setLoading(true);
        try {
            const url = `${API_URL}/api/pets?category=${encodeURIComponent(categoryQuery)}&minPrice=${minPriceQuery}&maxPrice=${maxPriceQuery}&sort=${sortQuery}&search=${encodeURIComponent(searchQuery)}`;
            const { data } = await axios.get(url);
            setPets(data);
        } catch (e) {
            console.error(e);
            toast.error(t('Failed to load pets'));
        } finally {
            setLoading(false);
        }
    };

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) {
                params.set(key, newFilters[key]);
            } else {
                params.delete(key);
            }
        });
        setSearchParams(params);
    };

    const handleAddToCart = (pet) => {
        addToCart(pet);
        toast.success(`${t(pet.name)} ${t('added to cart!')}`, {
            icon: '🐾',
            style: { borderRadius: '15px', background: '#333', color: '#fff' }
        });
    };

    const handleBuyNow = (pet) => {
        addToCart(pet);
        navigate('/checkout');
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className="pt-28 pb-20 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar Filters */}
                        <aside className="lg:w-1/4 space-y-8">
                            <div className="vibrant-card p-6 sticky top-28">
                                <div className="flex items-center gap-2 mb-8 text-xl font-bold text-slate-100">
                                    <Filter className="w-5 h-5 text-emerald-500" />
                                    <span>{t('Filters')}</span>
                                </div>

                                {/* Category */}
                                <div className="mb-8">
                                    <h4 className="font-semibold mb-4 text-slate-400 uppercase text-xs tracking-widest">{t('Category')}</h4>
                                    <div className="space-y-3">
                                        {['', 'Birds', 'Mammals', 'Small Animals', 'Reptiles', 'Aquarium'].map(cat => (
                                            <button
                                                key={cat}
                                                className={`block w-full text-left px-3 py-2 rounded-xl transition-all ${categoryQuery === cat ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-emerald-500/10 text-slate-400'}`}
                                                onClick={() => updateFilters({ category: cat })}
                                            >
                                                {t(cat) || t('All Categories')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-8">
                                    <h4 className="font-semibold mb-4 text-slate-400 uppercase text-xs tracking-widest">{t('Price Range')}</h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('Min')}
                                            className="w-1/2 p-3 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:ring-2 ring-emerald-500/20 text-slate-200"
                                            value={minPriceQuery}
                                            onChange={(e) => updateFilters({ minPrice: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            placeholder={t('Max')}
                                            className="w-1/2 p-3 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:ring-2 ring-emerald-500/20 text-slate-200"
                                            value={maxPriceQuery}
                                            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Sorting */}
                                <div className="mb-8">
                                    <h4 className="font-semibold mb-4 text-slate-400 uppercase text-xs tracking-widest">{t('Sort By')}</h4>
                                    <select
                                        className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl outline-none appearance-none"
                                        value={sortQuery}
                                        onChange={(e) => updateFilters({ sort: e.target.value })}
                                    >
                                        <option value="">{t('Default')}</option>
                                        <option value="low">{t('Price: Low to High')}</option>
                                        <option value="high">{t('Price: High to Low')}</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => setSearchParams({})}
                                    className="w-full py-3 text-red-400 font-semibold hover:bg-red-950/30 rounded-xl transition-colors"
                                >
                                    {t('Clear All filters')}
                                </button>
                            </div>
                        </aside>

                        {/* Main Product Grid */}
                        <main className="lg:w-3/4">
                            <div className="vibrant-card p-4 mb-8 flex items-center justify-between">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); updateFilters({ search: searchTerm }); }}
                                    className="relative flex-1 max-w-md"
                                >
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder={t('Search pets, breeds...')}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm !== searchQuery && (
                                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                                            {t('Apply')}
                                        </button>
                                    )}
                                </form>
                                <p className="text-slate-400 font-medium px-4">{pets.length} {t('Results found')}</p>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                                    {[1, 2, 3, 4, 5, 6].map(n => (
                                        <div key={n} className="vibrant-card h-[450px] animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                                    {pets.map(pet => (
                                        <div key={pet._id} className="group vibrant-card overflow-hidden card-hover flex flex-col items-stretch text-left">
                                            <div className="relative h-64 overflow-hidden">
                                                 <img
                                                    src={getPetImageUrl(pet.images?.[0])}
                                                    alt={t(pet.name)}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 right-4 space-y-2">
                                                    <span className="bg-slate-900/80 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-emerald-400 border border-slate-700 shadow-lg block">
                                                        {t(pet.category)}
                                                    </span>
                                                    {pet.stock > 0 ? (
                                                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm">
                                                            <Check size={10} /> {t('In Stock')}
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg backdrop-blur-sm">
                                                            {t('Out of Stock')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                             <div className="p-7 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-xl font-black group-hover:text-emerald-400 transition-colors uppercase tracking-tight text-slate-200">{t(pet.name)}</h3>
                                                    <p className="text-2xl font-black text-emerald-400 tracking-tighter">₹{pet.price}</p>
                                                </div>
                                                <p className="text-slate-500 text-sm mb-6 font-medium line-clamp-1">{t(pet.breed)} • {t(pet.age)}</p>
                                                <div className="mt-auto flex gap-2">
                                                    <button
                                                        onClick={() => handleAddToCart(pet)}
                                                        disabled={pet.stock === 0}
                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:bg-slate-700 active:scale-95 shadow-lg shadow-emerald-900/20"
                                                    >
                                                        <ShoppingCart className="w-4 h-4 group-hover/btn:-translate-y-1 transition-transform" /> {t('Add')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleBuyNow(pet)}
                                                        disabled={pet.stock === 0}
                                                        className="flex-1 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 group/buy disabled:opacity-50 disabled:bg-slate-700 active:scale-95 shadow-lg shadow-emerald-900/20"
                                                    >
                                                        <Zap className="w-4 h-4 group-hover/buy:-translate-y-1 transition-transform" /> {t('Buy')}
                                                    </button>
                                                    <Link
                                                        to={`/pet/${pet._id}`}
                                                        className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 p-3.5 rounded-2xl transition-all active:scale-95 shadow-sm"
                                                    >
                                                        <Info className="w-5 h-5 text-slate-400" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {pets.length === 0 && (
                                        <div className="col-span-full py-20 text-center">
                                            <div className="text-8xl mb-6">🔍</div>
                                            <h3 className="text-2xl font-bold text-slate-500">{t('No pets found matching your filters')}</h3>
                                        </div>
                                    )}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl shadow-emerald-900/30 transition-all duration-300 active:scale-90 hover:scale-110"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
            )}
        </>
    );
};

export default Shop;
