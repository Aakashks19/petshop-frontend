import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import toast from 'react-hot-toast';
import { CreditCard, Truck, MapPin, Phone, User, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Checkout = () => {
    const { t } = useTranslation();
    const { cartItems, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: '',
        paymentMethod: 'COD'
    });

    const handlePlaceOrder = async () => {
        const loadToast = toast.loading(t('Processing your order...'));
        try {
            const orderData = {
                products: cartItems.map(item => ({
                    petId: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: subtotal,
                customerName: formData.name,
                deliveryAddress: `${formData.address}${formData.city ? `, ${formData.city}` : ''}`,
                phone: formData.phone,
                paymentMethod: formData.paymentMethod
            };

            await axios.post(`${API_URL}/api/orders`, orderData);
            toast.success(t('Order placed successfully! 🐾'), { id: loadToast });
            clearCart();
            setStep(3); // Confirmation step
        } catch (e) {
            toast.error(e.response?.data?.message || t('Failed to place order'), { id: loadToast });
        }
    };

    if (cartItems.length === 0 && step !== 3) {
        navigate('/shop');
        return null;
    }

    return (
        <div className="pt-28 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Checkout Stepper */}
                <div className="max-w-3xl mx-auto mb-16 px-4">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
                        <div className={`absolute top-1/2 left-0 h-0.5 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`} />

                        {[1, 2, 3].map((s) => (
                            <div key={s} className="relative z-10 flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= s ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'bg-slate-800 text-slate-500 border-2 border-slate-700'}`}>
                                    {step > s ? <CheckCircle2 size={24} /> : s}
                                </div>
                                <span className={`absolute -bottom-8 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${step >= s ? 'text-emerald-500' : 'text-slate-500'}`}>
                                    {s === 1 ? t('Details') : s === 2 ? t('Payment') : t('Success')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
                        {/* Shipping Details */}
                        <div className="lg:w-2/3 space-y-8">
                            <div className="vibrant-card p-10">
                                <h2 className="text-3xl font-black mb-10 flex items-center gap-4 text-slate-100">
                                    <Truck className="text-emerald-500" /> {t('Delivery Details')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-400 flex items-center gap-2"><User size={16} /> {t('Customer Name')}</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-400 flex items-center gap-2"><Phone size={16} /> {t('Phone Number')}</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-full space-y-4">
                                        <label className="text-sm font-bold text-slate-400 flex items-center gap-2"><MapPin size={16} /> {t('Complete Address')}</label>
                                        <textarea
                                            className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 h-32"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-400">{t('City / State')}</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!formData.name || !formData.phone || !formData.address || !formData.city) {
                                            toast.error(t('Please fill all delivery details'));
                                            return;
                                        }
                                        setStep(2);
                                    }}
                                    className="w-full btn-primary py-5 mt-12 text-lg flex items-center justify-center gap-3"
                                >
                                    {t('Continue to Payment')} <ArrowRight />
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-1/3">
                            <div className="vibrant-card p-10 sticky top-28">
                                <h3 className="text-xl font-bold mb-8 text-slate-100">{t('Order Highlights')}</h3>
                                <div className="space-y-6 mb-8">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="flex gap-4">
                                            <img src={item.images[0]} className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-800" />
                                            <div>
                                                <h4 className="font-bold text-sm uppercase tracking-tight text-slate-200">{t(item.name)}</h4>
                                                <p className="text-xs text-slate-500">{t('Qty')}: {item.quantity}</p>
                                                <p className="text-emerald-500 font-bold text-sm">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-slate-700 pt-6 space-y-3">
                                    <div className="flex justify-between font-medium text-slate-500">
                                        <span>{t('Subtotal')}</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between font-black text-2xl text-emerald-400">
                                        <span>{t('Total')}</span>
                                        <span className="drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">₹{subtotal}</span>
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <ShieldCheck className="text-emerald-500 w-5 h-5" /> {t('100% Health Guarantee')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-2xl mx-auto vibrant-card p-12">
                        <h2 className="text-3xl font-black mb-12 flex items-center gap-4 text-slate-100">
                            <CreditCard className="text-emerald-500" /> {t('Payment Selection')}
                        </h2>

                        <div className="space-y-4 mb-12">
                            {[
                                { id: 'COD', label: t('Cash on Delivery'), desc: t('Pay when your new pet arrives safely.') },
                                { id: 'UPI', label: t('UPI / Online Transfer'), desc: t('Secure payment via GPay, PhonePe, or Cards.') }
                            ].map(method => (
                                <label
                                    key={method.id}
                                    className={`flex items-center gap-6 p-8 rounded-3xl border-2 transition-all cursor-pointer ${formData.paymentMethod === method.id ? 'border-emerald-600 bg-emerald-500/10' : 'border-slate-800 hover:border-emerald-500/30'}`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="w-6 h-6 accent-emerald-500"
                                        checked={formData.paymentMethod === method.id}
                                        onChange={() => setFormData({ ...formData, paymentMethod: method.id })}
                                    />
                                    <div>
                                        <h4 className="text-xl font-bold mb-1 text-slate-100">{method.label}</h4>
                                        <p className="text-slate-500 text-sm font-medium">{method.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-5 text-slate-500 font-bold hover:text-slate-300 transition-colors"
                            >
                                {t('Back to Details')}
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="flex-[2] btn-primary py-5 text-lg"
                            >
                                {t('Complete Order')} (₹{subtotal})
                            </button>
                        </div>
                        <p className="text-center text-slate-500 text-xs mt-8 font-medium italic">
                            {t('By placing this order, you agree to our pet care and adoption terms.')}
                        </p>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-3xl mx-auto text-center py-20 vibrant-card px-10">
                        <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 text-emerald-500 animate-bounce shadow-2xl shadow-emerald-500/20 border border-emerald-500/20">
                            <CheckCircle2 size={64} />
                        </div>
                        <h2 className="text-5xl font-black mb-6 text-slate-100">{t('Order Confirmed!')}</h2>
                        <p className="text-slate-400 text-xl mb-12 font-medium max-w-lg mx-auto">
                            {t('Thank you for your order. We\'ve sent the details to your email and our team will contact you shortly for delivery scheduling.')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn-primary px-12 py-5"
                            >
                                {t('View My Orders')}
                            </button>
                            <button
                                onClick={() => navigate('/shop')}
                                className="btn-outline px-12 py-5"
                            >
                                {t('Continue Shopping')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
