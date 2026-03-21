import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { ArrowRight, Bird, Fish, Cat, Dog, Rabbit, ShieldCheck, Truck, Clock, ShoppingCart, ArrowUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getPetImageUrl } from '../utils/imageUtils';

const categories = [
    { name: 'Birds', icon: Bird, color: 'bg-emerald-950/30 text-emerald-400', pets: 'Lovebirds, Cockatiel, Parrots' },
    { name: 'Mammals', icon: Dog, color: 'bg-emerald-900/40 text-emerald-400', pets: 'Dogs, Persian Cats, Rabbits' },
    { name: 'Small Animals', icon: Rabbit, color: 'bg-emerald-950/30 text-emerald-400', pets: 'Hamsters, Hedgehogs, Guinea Pigs' },
    { name: 'Reptiles', icon: ShieldCheck, color: 'bg-emerald-900/40 text-emerald-400', pets: 'Iguanas, Turtles, Snakes' },
    { name: 'Aquarium', icon: Fish, color: 'bg-emerald-950/30 text-emerald-400', pets: 'Goldfish, Betas, Tropical Fish' },
];

const Home = () => {
    const { t } = useTranslation();
    const [featuredPets, setFeaturedPets] = useState([]);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const featuredCarouselRef = useRef(null);
    const FEATURED_CAROUSEL_LIMIT = 24;

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

    const fetchPets = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/pets`);
            const all = (data || []).filter(Boolean);
            const featured = all.filter(p => p?.featured);
            const nonFeatured = all.filter(p => !p?.featured);

            // If featured exists, show featured first then fill with others.
            const list = featured.length > 0 ? [...featured, ...nonFeatured] : all;

            setFeaturedPets(list.slice(0, FEATURED_CAROUSEL_LIMIT));
        } catch (e) {
            console.error('Error fetching featured pets');
        }
    };

    useEffect(() => {
        fetchPets();

        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToCategories = () => {
        const element = document.getElementById('categories');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollFeatured = (direction) => {
        const el = featuredCarouselRef.current;
        if (!el) return;
        const firstCard = el.querySelector('[data-featured-card="true"]');
        const cardWidth = firstCard?.getBoundingClientRect?.().width || 320;
        const computed = window.getComputedStyle(el);
        const gap = Number.parseFloat(computed.columnGap || computed.gap || '0') || 0;
        const amount = Math.max(280, Math.floor(cardWidth + gap));
        el.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    return (
        <div className="pt-20 home-vibrant-bg">
            {/* Background Decorative Blob */}
            <div className="vibrant-blob-emerald top-[-10%] left-[20%] animate-mesh opacity-30" />
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center overflow-hidden">
                {/* Background Pet Images */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden sm:block hidden">
                    <img
                        src="/images/pets/golden_retriever.jpg"
                        className="absolute top-[10%] right-[5%] w-64 h-64 object-cover rounded-full opacity-[0.08] animate-float-slow grayscale hover:grayscale-0 transition-all duration-700"
                        alt=""
                    />
                    <img
                        src="/images/pets/siamese_cat.jpg"
                        className="absolute bottom-[10%] left-[5%] w-56 h-56 object-cover rounded-full opacity-[0.08] animate-float-medium grayscale hover:grayscale-0 transition-all duration-700"
                        style={{ animationDelay: '2s' }}
                        alt=""
                    />
                    <img
                        src="/images/pets/african_lovebird.jpg"
                        className="absolute top-[20%] left-[15%] w-40 h-40 object-cover rounded-full opacity-[0.1] animate-float-slow grayscale hover:grayscale-0 transition-all duration-700"
                        style={{ animationDelay: '4s' }}
                        alt=""
                    />
                    <img
                        src="/images/pets/holland_lop_rabbit.jpg"
                        className="absolute bottom-[20%] right-[15%] w-48 h-48 object-cover rounded-full opacity-[0.08] animate-float-medium grayscale hover:grayscale-0 transition-all duration-700"
                        style={{ animationDelay: '1s' }}
                        alt=""
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                    <div className="max-w-2xl mb-12">
                        <span className="inline-block py-1.5 px-4 bg-slate-800/40 backdrop-blur-md text-emerald-400 rounded-full font-bold text-xs mb-6 uppercase tracking-widest border border-white/10 shadow-sm">
                            🐾 {t("Welcome to Exotic Pet's Paradise")}
                        </span>
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                {t('Guaranteed Same-Day dispatch')}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                {t('International export support')}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-6">
                            <span className="bg-emerald-600/20 border border-emerald-500/30 px-4 py-2 rounded-xl text-[10px] font-black text-center text-emerald-400 uppercase tracking-widest shadow-lg shadow-emerald-900/10">
                                {t('Safe Arrival Guarantee')}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-slate-100">
                            {t('Find Your New')} <span className="text-emerald-500">{t('Best Friend')}</span> {t('Today.')}
                        </h1>
                        <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
                            {t('Hero Description')}
                        </p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link to="/shop" className="btn-primary flex items-center gap-2 group">
                                {t('Shop Now')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={scrollToCategories}
                                className="px-7 py-3 rounded-2xl font-bold bg-slate-800/40 backdrop-blur-md text-slate-300 border border-white/10 hover:bg-slate-700/60 transition-all active:scale-95 text-sm shadow-sm"
                            >
                                {t('View Categories')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Pets */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs mb-3 block">{t('Premium Picks')}</span>
                            <h2 className="text-5xl font-black tracking-tight text-slate-100">{t('Featured Pets')}</h2>
                        </div>
                        <Link to="/shop" className="group flex items-center gap-3 font-bold text-lg text-emerald-500 hover:text-emerald-300 transition-all underline underline-offset-8 decoration-2">
                            {t('Explore the Shop')} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="relative">
                        {/* Arrow Controls */}
                        <button
                            type="button"
                            onClick={() => scrollFeatured(-1)}
                            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-2xl bg-slate-800/80 backdrop-blur-md border border-white/10 shadow-xl hover:bg-slate-700 transition-all active:scale-95"
                            aria-label="Scroll featured pets left"
                        >
                            <ChevronLeft className="text-slate-300" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollFeatured(1)}
                            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-2xl bg-slate-800/80 backdrop-blur-md border border-white/10 shadow-xl hover:bg-slate-700 transition-all active:scale-95"
                            aria-label="Scroll featured pets right"
                        >
                            <ChevronRight className="text-slate-300" />
                        </button>

                        {/* Carousel */}
                        <div
                            ref={featuredCarouselRef}
                            className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pr-4 -mr-4"
                        >
                            {featuredPets.map((pet) => (
                                <div
                                    key={pet._id}
                                    data-featured-card="true"
                                    className="group vibrant-card p-6 card-hover snap-start shrink-0 w-[86%] sm:w-[360px] lg:w-[380px]"
                                >
                                    <Link to={`/pet/${pet._id}`}>
                                        <div className="relative mb-6 overflow-hidden rounded-[2.5rem] aspect-square">
                                            <img
                                                src={getPetImageUrl(pet.images?.[0])}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                alt={t(pet.name)}
                                            />
                                        </div>
                                        <h4 className="text-xl font-black uppercase tracking-tighter mb-2 text-slate-200 group-hover:text-emerald-400 transition-colors">{t(pet.name)}</h4>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="font-black text-2xl text-emerald-400 tracking-tighter">₹{pet.price}</p>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">{t(pet.breed || pet.category)}</span>
                                        </div>
                                    </Link>
                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            onClick={() => handleAddToCart(pet)}
                                            disabled={pet.stock === 0}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 text-sm active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:bg-slate-700"
                                        >
                                            <ShoppingCart className="w-4 h-4" /> {t('Add')}
                                        </button>
                                        <button
                                            onClick={() => handleBuyNow(pet)}
                                            disabled={pet.stock === 0}
                                            className="flex-1 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 text-sm active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:bg-slate-700"
                                        >
                                            <Zap className="w-4 h-4" /> {t('Buy')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 md:hidden">
                            {t('Swipe to explore')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: ShieldCheck, title: t('Safe & Verified'), desc: t('All pets are health-checked and vaccinated before delivery.') },
                            { icon: Truck, title: t('Express Delivery'), desc: t('Secure transport for your pets directly to your doorstep.') },
                            { icon: Clock, title: t('24/7 Support'), desc: t('Expert guidance for pet care and onboarding for new owners.') }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-6 group vibrant-card p-8 card-hover">
                                <div className="bg-emerald-500/10 p-4 rounded-2xl group-hover:bg-emerald-600 transition-colors duration-500">
                                    <feature.icon className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-100">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm font-medium">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section id="categories" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-4 block">{t('Pet Collections')}</span>
                        <h2 className="text-5xl font-black text-slate-100 tracking-tight mb-4">{t('Explore Categories')}</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto font-medium">{t('Find the perfect addition to your family by browsing our specialized exotic collections.')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {categories.map((cat, i) => (
                            <Link
                                to={`/shop?category=${cat.name}`}
                                key={i}
                                className="group vibrant-card p-8 card-hover flex flex-col items-center text-center relative overflow-hidden"
                            >
                                <div className={`${cat.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-4xl group-hover:rotate-6 transition-all duration-500 relative z-10`}>
                                    <cat.icon size={40} />
                                </div>
                                <h3 className="text-2xl font-black mb-2 text-slate-100 group-hover:text-emerald-400 transition-colors relative z-10">{t(cat.name)}</h3>
                                <p className="text-slate-500 text-sm mb-8 leading-relaxed relative z-10 font-medium">{t(cat.pets)}</p>

                                <div className="mt-auto flex items-center gap-2 font-bold text-emerald-500 group-hover:gap-4 transition-all duration-300">
                                    <span>{t('Browse')}</span>
                                    <ArrowRight size={18} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Adoption Banner */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-emerald-900/40 via-slate-900 to-emerald-950 rounded-[4rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 border border-slate-700/50 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -mr-64 -mt-64" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-400/20 rounded-full blur-3xl -ml-48 -mb-48" />

                    <div className="relative z-10 flex-1">
                        <span className="inline-block py-2 px-5 bg-white/20 backdrop-blur-md text-white rounded-full font-bold text-sm mb-8 uppercase tracking-[0.2em] border border-white/30">
                            {t('Make a Difference')}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-100 mb-8 leading-tight tracking-tight">{t('Ready to welcome a')} <span className="text-emerald-500">{t('new family member?')}</span></h2>
                        <p className="text-slate-400 text-xl mb-12 max-w-lg font-medium opacity-90 leading-relaxed">
                            {t('Browse our shop for thousands of pets looking for a forever home. Each one is cared for with love and waiting for you.')}
                        </p>
                        <Link to="/shop" className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black text-lg hover:shadow-2xl hover:shadow-emerald-600/20 transition-all active:scale-95 inline-block">
                            {t('Adopt a Pet Now')}
                        </Link>
                    </div>
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-white/10 rounded-[3rem] blur-2xl group-hover:scale-110 transition-transform duration-700" />
                        <img
                            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Adoption"
                            className="rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 scale-110 relative z-10"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-5xl font-black mb-16 text-slate-100 tracking-tight">{t('Happy Pet Owners')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah J.', text: t('The delivery was so smooth, and my lovebirds arrived healthy and chirpy!'), avatar: 'https://i.pravatar.cc/150?u=sarah' },
                            { name: 'Michael K.', text: t('Expert staff helped me pick the right hamster cage and food. Highly recommend!'), avatar: 'https://i.pravatar.cc/150?u=michael' },
                            { name: 'Elena R.', text: t('Exotic Pet\'s is the best place for reptiles. My iguana is stunning.'), avatar: 'https://i.pravatar.cc/150?u=elena' }
                        ].map((testimonial, i) => (
                            <div key={i} className="vibrant-card p-10 card-hover flex flex-col items-center">
                                <div className="relative mb-6">
                                    <img src={testimonial.avatar} className="w-24 h-24 rounded-full ring-8 ring-slate-800 shadow-inner" alt={testimonial.name} />
                                    <div className="absolute -bottom-2 -right-2 bg-accent-400 text-white p-2 rounded-full shadow-lg">
                                        <ShieldCheck size={16} />
                                    </div>
                                </div>
                                <p className="italic text-slate-300 mb-6 font-medium text-lg leading-relaxed">"{testimonial.text}"</p>
                                <h4 className="font-black text-xl text-slate-100 tracking-tight">{testimonial.name}</h4>
                                <div className="text-accent-400 text-sm mt-3 bg-accent-950/30 px-4 py-1 rounded-full font-bold">⭐⭐⭐⭐⭐</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-[100] p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl transition-all duration-500 hover:bg-emerald-700 hover:-translate-y-2 active:scale-90 ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                aria-label="Back to Top"
            >
                <ArrowUp size={24} strokeWidth={3} />
            </button>
        </div>
    );
};

export default Home;
