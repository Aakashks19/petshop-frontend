import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, PawPrint } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading(isRegister ? t('Creating your account...') : t('Signing in...'));
        try {
            if (isRegister) {
                await register(formData);
                toast.success(t('Welcome to the family!'), { id: loadToast });
                navigate('/');
            } else {
                const loggedInUser = await login(formData.email, formData.password);
                toast.success(t('Welcome back!'), { id: loadToast });
                if (loggedInUser && loggedInUser.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message || t('Authentication failed');
            toast.error(errorMessage, { id: loadToast });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className="max-w-6xl w-full flex vibrant-card overflow-hidden min-h-[700px]">

                {/* Left Side: Illustration/Text */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-950 via-emerald-900 to-accent-900 p-16 flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full -mr-48 -mt-48 blur-3xl opacity-30" />
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 mb-12">
                            <div className="bg-slate-100 p-2 rounded-xl text-emerald-900"><PawPrint /></div>
                            <span className="text-2xl font-bold">Exotic Pets</span>
                        </Link>
                        <h2 className="text-5xl font-bold leading-tight mb-6">
                            {t('Join our community of pet lovers.')}
                        </h2>
                        <p className="text-xl text-emerald-200">
                            {t('Manage your orders, track pet deliveries, and get exclusive offers on exotic pets.')}
                        </p>
                    </div>
                    <div className="relative z-10 bg-emerald-800/30 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
                        <div className="flex gap-4 mb-4">
                            {[1, 2, 3].map(i => <div key={i} className="w-12 h-12 bg-slate-700/50 rounded-full border-2 border-emerald-500 shadow-lg" />)}
                        </div>
                        <p className="font-medium">"{t('I found my perfect Macaw here! The process was so professional and safe.')}"</p>
                        <p className="text-emerald-400 mt-2 font-bold">— David H.</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 p-12 md:p-20 flex flex-col justify-center">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black mb-4 text-slate-100">{isRegister ? t('Start Your Journey') : t('Glad to see you!')}</h1>
                        <p className="text-slate-400 font-medium">
                            {isRegister ? t('Already have an account?') : t('New to Exotic Pets?')}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="ml-2 text-emerald-500 font-bold hover:underline"
                            >
                                {isRegister ? t('Login here') : t('Create an account')}
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegister && (
                            <div className="space-y-6">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="text" placeholder={t('Full Name')} required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <input
                                        type="text" placeholder={t('Phone Number')}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="text" placeholder={t('Email Address / Username')} required
                                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password" placeholder={t('Password')} required
                                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {isRegister && (
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                                <textarea
                                    placeholder={t('Delivery Address')}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 h-24"
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        )}

                        <button type="submit" className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3">
                            {isRegister ? t('Create Account') : t('Sign In Now')} <ArrowRight />
                        </button>
                    </form>

                    <div className="mt-12 text-center text-slate-500 text-sm font-medium">
                        {t('By continuing, you agree to our Terms of Service and Privacy Policy.')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
