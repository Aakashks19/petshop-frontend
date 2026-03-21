import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import {
    ChevronLeft, ShoppingCart, ShieldCheck, Heart,
    Calendar, BadgeCheck, Syringe, Info, Star, X, Users
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useTranslation } from 'react-i18next';
import { getPetImageUrl } from '../utils/imageUtils';

const PetDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedPets, setRelatedPets] = useState([]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_URL}/api/pets/${id}`);
                setPet(data);
                setActiveImageIndex(0);

                // Fetch related pets (same category)
                const res = await axios.get(`${API_URL}/api/pets?category=${data.category}`);
                setRelatedPets(res.data.filter(p => p._id !== id).slice(0, 4));
            } catch (e) {
                toast.error(t('Failed to load pet details'));
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="pt-40 pb-20 text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest">{t('Finding your future pet...')}</p>
        </div>
    );

    if (!pet) return (
        <div className="pt-40 pb-20 text-center px-4 text-slate-100">
            <h2 className="text-4xl font-black mb-6">{t('Pet not found')}</h2>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                <ChevronLeft size={20} /> {t('Back to Shop')}
            </Link>
        </div>
    );

    return (
        <div className="pt-28 pb-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Navigation Breadcrumb */}
                <div className="mb-8 overflow-x-auto whitespace-nowrap">
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-500">
                        <Link to="/" className="hover:text-emerald-400 transition-colors">{t('Home')}</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-emerald-400 transition-colors">{t('Shop')}</Link>
                        <span>/</span>
                        <Link to={`/shop?category=${pet.category}`} className="hover:text-emerald-400 transition-colors">{t(pet.category)}</Link>
                        <span>/</span>
                        <span className="text-emerald-400">{t(pet.name)}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left: Image Gallery */}
                    <div className="lg:w-1/2">
                        <div className="relative group">
                            <img
                                src={getPetImageUrl(pet.images?.[activeImageIndex] ?? pet.images?.[0])}
                                alt={t(pet.name)}
                                className="w-full aspect-square object-cover rounded-[3.5rem] shadow-2xl shadow-emerald-900/40 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                            {pet.stock < 3 && pet.stock > 0 && (
                                <div className="absolute top-8 left-8 bg-orange-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest animate-pulse shadow-lg">
                                    {t('Last')} {pet.stock} {t('Left!')}
                                </div>
                            )}
                            <button 
                                onClick={() => {
                                    const wasFavorite = isFavorite(pet._id);
                                    toggleFavorite(pet);
                                    toast.success(
                                        wasFavorite 
                                            ? `${t(pet.name)} ${t('removed from favorites')}` 
                                            : `${t(pet.name)} ${t('added to favorites')}`,
                                        { icon: '❤️' }
                                    );
                                }}
                                className={`absolute top-8 right-8 bg-slate-900/80 backdrop-blur-md p-4 rounded-full transition-all shadow-xl hover:scale-110 border border-slate-700 ${
                                    isFavorite(pet._id) 
                                        ? 'text-red-500' 
                                        : 'text-slate-400 hover:text-red-500'
                                    }`}
                                >
                                    <Heart size={24} className={isFavorite(pet._id) ? 'fill-current' : ''} />
                                </button>
                        </div>

                        {/* More Images (Thumbnail placeholder) */}
                        <div className="grid grid-cols-4 gap-4 mt-8">
                            {Array.from({ length: 4 }).map((_, i) => {
                                const img = pet.images?.[i];
                                const isActive = i === activeImageIndex;
                                const isClickable = Boolean(img);
                                const hasMore = (pet.images?.length || 0) > 4;
                                const remaining = Math.max(0, (pet.images?.length || 0) - 4);
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            if (!img) return;
                                            if (i === 3 && hasMore) {
                                                setIsGalleryOpen(true);
                                                return;
                                            }
                                            setActiveImageIndex(i);
                                        }}
                                        disabled={!isClickable}
                                        className={`aspect-square rounded-3xl bg-slate-800 border-4 transition-all overflow-hidden ${isActive ? 'border-emerald-500 opacity-100' : 'border-transparent'} ${isClickable ? 'hover:border-slate-600 opacity-60 hover:opacity-100 cursor-pointer' : 'opacity-30 cursor-default'}`}
                                        aria-label={img ? `View image ${i + 1}` : `No image ${i + 1}`}
                                    >
                                        {img ? (
                                            <div className="relative w-full h-full">
                                                <img src={getPetImageUrl(img)} className="w-full h-full object-cover" alt={`${t(pet.name)} thumbnail ${i + 1}`} />
                                                {i === 3 && hasMore && (
                                                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center">
                                                        <div className="text-white font-black text-xl">
                                                            +{remaining}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>

                        {(pet.images?.length || 0) > 4 && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsGalleryOpen(true)}
                                    className="text-sm font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors underline underline-offset-4"
                                >
                                    {t('View all')} {pet.images.length} {t('photos')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className="lg:w-1/2 space-y-10 text-slate-100">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                                    {t(pet.category)}
                                </span>
                                <div className="flex items-center text-accent-400 gap-1">
                                    <Star size={16} className="fill-current" />
                                    <span className="font-black text-sm">4.8 (24 {t('Reviews')})</span>
                                </div>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter mb-4 text-slate-100">{t(pet.name)}</h1>
                            <p className="text-slate-500 font-bold text-xl">{t(pet.breed)} • {t(pet.gender)}</p>
                        </div>

                        <div className="flex items-center justify-between p-8 vibrant-card">
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{t('Adoption Price')}</p>
                                <p className="text-5xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">₹{pet.price}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">{t('Status')}</p>
                                <p className="text-lg font-bold text-slate-200">{t('Ready to Adopt')}</p>
                            </div>
                        </div>

                        {/* Pet Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Age', value: t(pet.age) || t('Unknown'), icon: Calendar },
                                { label: 'Gender', value: t(pet.gender) || t('Male'), icon: BadgeCheck },
                                { label: 'Pairs', value: pet.pairs ? `${pet.pairs} ${pet.pairs === 1 ? t('Pair') : t('Pairs')}` : `1 ${t('Pair')}`, icon: Users },
                                { label: 'Medical Status', value: t(pet.medicalStatus) || t('Certified'), icon: Syringe },
                                { label: 'Vaccination', value: t(pet.vaccinationStatus) || t('Fully Vaccinated'), icon: ShieldCheck },
                            ].map((stat, i) => (
                                <div key={i} className="vibrant-card p-6 flex items-center gap-4 group card-hover !rounded-3xl hover:bg-emerald-500/10 transition-all duration-300">
                                    <div className="bg-slate-800 p-3 rounded-2xl group-hover:bg-emerald-600 transition-all duration-300 shadow-inner">
                                        <stat.icon className="text-emerald-500 group-hover:text-white w-6 h-6 transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors duration-300">{t(stat.label)}</p>
                                        <p className="font-bold text-sm group-hover:text-emerald-400 transition-colors duration-300 text-slate-200">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
                                <Info className="text-emerald-500" size={20} /> {t('About')} {t(pet.name)}
                            </h3>
                            <p className="text-slate-400 leading-relaxed font-serif text-lg">
                                {pet.description || t("This beautiful exotic pet is looking for a forever home. They are well-behaved, healthy, and ready to meet their new family. Includes basic care package and health certification.")}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-100/50 flex gap-4">
                            <button
                                onClick={() => {
                                    addToCart(pet);
                                    toast.success(`${t(pet.name)} ${t('added to cart!')}`, { icon: '🐾' });
                                }}
                                disabled={pet.stock === 0}
                                className={`flex-[2] py-6 rounded-[2.5rem] text-xl font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95 ${pet.stock > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-950 shadow-2xl shadow-emerald-900/40' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            >
                                {pet.stock > 0 ? (
                                    <>
                                        <ShoppingCart size={24} /> {t('Add to Cart')}
                                    </>
                                ) : t('Out of Stock')}
                            </button>
                            <button
                                onClick={() => {
                                    if (pet.stock === 0) return;
                                    addToCart(pet);
                                    navigate('/checkout');
                                }}
                                disabled={pet.stock === 0}
                                className={`flex-1 py-6 rounded-[2.5rem] text-xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${pet.stock > 0
                                    ? 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white shadow-emerald-900/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-slate-900/20'
                                }`}
                            >
                                {t('Buy Now')}
                            </button>
                            <button className="flex-1 bg-slate-800 border-2 border-emerald-500/20 text-emerald-400 py-6 rounded-[2.5rem] text-xl font-black uppercase tracking-widest hover:bg-emerald-500/10 shadow-2xl shadow-emerald-900/10 transition-all active:scale-95">
                                {t('Adopt')}
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                {t('Live Expert Support')}
                            </div>
                            <div className="flex items-center gap-2 underline underline-offset-4 cursor-pointer hover:text-emerald-400 transition-colors">
                                {t('Shipping & Delivery Policy')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Modal */}
                {isGalleryOpen && (
                    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="vibrant-card w-full max-w-4xl overflow-hidden border border-slate-700">
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-slate-100">{t('Photos')}</h3>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                                        {pet.images?.length || 0} {t('total')}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsGalleryOpen(false)}
                                    className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
                                    aria-label={t('Close gallery')}
                                >
                                    <X />
                                </button>
                            </div>

                            <div className="p-6 max-h-[75vh] overflow-y-auto">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {(pet.images || []).filter(Boolean).map((img, idx) => (
                                        <button
                                            key={`${img}-${idx}`}
                                            type="button"
                                            onClick={() => {
                                                setActiveImageIndex(idx);
                                                setIsGalleryOpen(false);
                                            }}
                                            className={`overflow-hidden rounded-3xl border-4 transition-all ${idx === activeImageIndex ? 'border-emerald-500' : 'border-transparent hover:border-slate-700'}`}
                                            aria-label={`${t('Select photo')} ${idx + 1}`}
                                        >
                                            <img src={getPetImageUrl(img)} alt={`${t(pet.name)} photo ${idx + 1}`} className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Pets Section */}
                {relatedPets.length > 0 && (
                    <div className="mt-32">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs mb-3">{t('You might also love')}</p>
                                <h2 className="text-5xl font-black tracking-tight text-slate-100">{t('More')} {t(pet.category)}</h2>
                            </div>
                            <Link to="/shop" className="btn-outline flex items-center gap-2">{t('View All')} <ChevronLeft className="rotate-180" /></Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2 md:px-0">
                            {relatedPets.map(p => (
                                <Link
                                    to={`/pet/${p._id}`}
                                    key={p._id}
                                    className="group vibrant-card p-6 card-hover"
                                >
                                    <div className="relative mb-6 overflow-hidden rounded-[2.5rem] aspect-square ring-1 ring-white/10">
                                        <img src={getPetImageUrl(p.images?.[0])} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={t(p.name)} />
                                    </div>
                                    <h4 className="text-xl font-black uppercase tracking-tighter mb-2 text-slate-100 group-hover:text-emerald-400 transition-colors">{t(p.name)}</h4>
                                    <div className="flex justify-between items-center">
                                        <p className="font-black text-emerald-400">₹{p.price}</p>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t(p.breed)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetDetails;
