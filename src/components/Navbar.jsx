import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, PawPrint, Search, ChevronDown, Languages } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const { user, logout, isAdmin } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ta', name: 'Tamil' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsLangOpen(false);
    };

    const categories = ['Birds', 'Small Animals', 'Reptiles', 'Mammals', 'Aquarium'];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${searchTerm}`);
            setSearchTerm('');
            setIsSearchOpen(false);
        }
    };

    return (
        <nav className="fixed w-full z-50 glass shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group mr-4 text-emerald-500">
                            <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-all">
                                <PawPrint className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent uppercase tracking-tight">
                                {t("Exotic Pet's")}
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8 font-medium">
                            <Link to="/" className="hover:text-primary-600 transition-colors">{t('Home')}</Link>

                            {/* Categories Dropdown */}
                            <div
                                className="relative group/category"
                                onMouseLeave={() => setIsCategoryOpen(false)}
                            >
                                <button
                                    onMouseEnter={() => setIsCategoryOpen(true)}
                                    className="flex items-center gap-1 hover:text-emerald-500 transition-colors py-8 text-slate-300"
                                >
                                    {t('Categories')} <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isCategoryOpen && (
                                    <div
                                        className="absolute top-[80%] left-0 w-48 vibrant-card py-3 mt-1 animate-in fade-in slide-in-from-top-2 !rounded-2xl border-slate-700 shadow-xl overflow-hidden"
                                    >
                                        {categories.map(cat => (
                                            <Link
                                                key={cat}
                                                to={`/shop?category=${cat}`}
                                                className="block px-6 py-2 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors text-slate-300"
                                                onClick={() => setIsCategoryOpen(false)}
                                            >
                                                {t(cat)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                                <Link to="/shop" className="hover:text-emerald-500 transition-colors text-slate-300 font-bold">{t('Shop')}</Link>
                                {isAdmin && <Link to="/admin" className="text-emerald-500 font-black hover:text-emerald-400">{t('Admin Panel')}</Link>}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar - Desktop */}
                        <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
                             <input
                                 type="text"
                                 placeholder={t('Search pets')}
                                 className="bg-slate-900 border border-slate-700 rounded-full py-2.5 pl-4 pr-10 focus:ring-2 ring-emerald-500/20 w-48 focus:w-64 transition-all outline-none text-sm placeholder:text-slate-500 text-slate-200 shadow-inner"
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                             />
                             <button type="submit" className="absolute right-3 text-slate-500 hover:text-emerald-500">
                                 <Search size={18} />
                             </button>
                        </form>

                        <div className="flex items-center gap-6 border-l md:pl-8 border-slate-800">
                            {/* Language Switcher - Desktop */}
                            <div className="relative group/lang" onMouseLeave={() => setIsLangOpen(false)}>
                                <button
                                    onMouseEnter={() => setIsLangOpen(true)}
                                    className="flex items-center gap-1 hover:text-emerald-500 transition-colors py-8"
                                >
                                    <Languages size={20} />
                                    <span className="text-xs uppercase font-bold text-gray-500">{i18n.language.split('-')[0]}</span>
                                </button>

                                 {isLangOpen && (
                                     <div className="absolute top-[80%] right-0 w-40 vibrant-card py-3 mt-1 animate-in fade-in slide-in-from-top-2 !rounded-2xl border-slate-700 shadow-xl overflow-hidden">
                                         {languages.map(lang => (
                                             <button
                                                 key={lang.code}
                                                 onClick={() => changeLanguage(lang.code)}
                                                 className={`w-full text-left px-6 py-2 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors text-slate-300 ${i18n.language === lang.code ? 'text-emerald-500 font-black' : ''}`}
                                             >
                                                 {lang.name}
                                             </button>
                                         ))}
                                     </div>
                                 )}
                            </div>

                             <Link to="/cart" className="relative flex items-center hover:text-emerald-500 transition-colors text-slate-400">
                                 <ShoppingCart className="w-6 h-6" />
                                 {cartItems.length > 0 && (
                                     <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg shadow-emerald-900/40">
                                         {cartItems.length}
                                     </span>
                                 )}
                             </Link>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/dashboard" className="flex items-center gap-2 group/user bg-slate-900/50 hover:bg-emerald-500/10 px-3 py-1.5 rounded-full transition-all border border-slate-700">
                                        <div className="bg-slate-800 p-1 rounded-full shadow-sm">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="hidden lg:block truncate max-w-[80px] font-bold text-sm text-slate-200">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 bg-red-950/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-all font-bold text-sm group/logout"
                                    >
                                        <span className="hidden lg:inline">{t('Logout')}</span>
                                        <LogOut className="w-4 h-4 group-hover/logout:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary flex items-center gap-2 px-8">
                                    {t('Login')}
                                </Link>
                            )}

                            {/* Mobile menu button */}
                            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-slate-800 p-6 space-y-6 shadow-2xl animate-in slide-in-from-top-4 overflow-y-auto max-h-[80vh]">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('Search pets')}
                            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl outline-none text-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/" className="block py-3 px-4 bg-slate-800 rounded-2xl text-center font-bold text-slate-200" onClick={() => setIsOpen(false)}>{t('Home')}</Link>
                        <Link to="/shop" className="block py-3 px-4 bg-slate-800 rounded-2xl text-center font-bold text-slate-200" onClick={() => setIsOpen(false)}>{t('Shop')}</Link>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">{t('Categories')}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map(cat => (
                                <Link
                                    key={cat}
                                    to={`/shop?category=${cat}`}
                                    className="block p-3 hover:bg-emerald-500/10 hover:text-emerald-400 font-medium text-sm transition-colors border border-slate-800 rounded-xl text-slate-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t(cat)}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Language Switcher */}
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">{t('Language')}</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`p-2 text-xs font-bold rounded-xl border transition-all ${i18n.language === lang.code ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isAdmin && <Link to="/admin" className="block py-3 text-center bg-accent-900/30 text-accent-400 rounded-2xl font-black" onClick={() => setIsOpen(false)}>{t('Admin Panel')}</Link>}

                    {user ? (
                        <div className="space-y-3 pt-4 border-t border-slate-800">
                            <Link to="/dashboard" className="block w-full py-4 text-center font-bold border-2 border-emerald-900/30 rounded-2xl hover:bg-emerald-500/10 transition-colors text-slate-200" onClick={() => setIsOpen(false)}>
                                {t('My Dashboard')}
                            </Link>
                            <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full py-4 text-center font-black bg-red-600 text-white rounded-2xl shadow-lg shadow-red-900/20">
                                {t('Logout')}
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="block btn-primary py-4 text-center text-lg" onClick={() => setIsOpen(false)}>{t('Login')}</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
