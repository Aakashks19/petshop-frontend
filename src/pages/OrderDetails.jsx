import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { ChevronLeft, Printer, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const OrderDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setError(null);
            console.log('Fetching details for order ID:', id);
            const { data } = await axios.get(`${API_URL}/api/orders/${id}`);
            console.log('Order data received:', data);
            setOrder(data);
        } catch (e) {
            console.error('Error fetching order details:', e);
            setError(e.response?.data?.message || t('Order not found or access denied'));
            toast.error(t('Failed to load order details'));
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('invoice-capture');
        const opt = {
            margin: 0,
            filename: `Invoice_${order._id.toUpperCase()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Trigger download
        window.html2pdf().from(element).set(opt).save();
    };

    if (loading) return <div className="pt-40 text-center font-bold text-slate-500">{t('Generating Invoice...')}</div>;
    if (error) return (
        <div className="pt-40 text-center px-4">
            <div className="text-red-500 font-bold mb-4">{error}</div>
            <Link to="/dashboard" className="text-emerald-500 font-bold hover:underline">{t('Back to Dashboard')}</Link>
        </div>
    );
    if (!order) return <div className="pt-40 text-center font-bold text-red-500">{t('Order not found.')}</div>;

    return (
        <div className="pt-28 pb-20 min-h-screen printable-area font-serif">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Actions */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 font-bold transition-colors">
                        <ChevronLeft size={20} /> {t('Back to Dashboard')}
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDownloadPDF}
                            className="bg-emerald-600 text-white flex items-center gap-2 px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20"
                        >
                            <Download size={18} /> {t('Download PDF')}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-slate-800 border-2 border-slate-700 text-slate-200 flex items-center gap-2 px-6 py-2 rounded-lg font-bold hover:bg-slate-700 transition-all"
                        >
                            <Printer size={18} /> {t('Print')}
                        </button>
                    </div>
                </div>

                {/* The Invoice Design */}
                <div id="invoice-capture" className="bg-slate-900 shadow-2xl relative overflow-hidden flex flex-col min-h-[1100px] border border-slate-800">

                    {/* Top Decorative Shapes */}
                    <div className="absolute top-0 left-0 w-full h-[280px] overflow-hidden z-0">
                        {/* Deep Navy/Black bg */}
                        <div className="absolute top-0 left-0 w-full h-full bg-slate-950" />
                        {/* Golden Accent Curve - Now Slate-900 */}
                        <div
                            className="absolute top-[-100px] left-[-10%] w-[120%] h-[300px] bg-slate-900 z-10"
                            style={{ borderRadius: '0 0 100% 100% / 0 0 100% 100%' }}
                        />
                        {/* Emerald Circle Accent */}
                        <div
                            className="absolute top-[-50px] right-[-50px] w-[250px] h-[250px] bg-emerald-500 rounded-full opacity-20 z-20"
                        />
                        {/* Simple dot patterns */}
                        <div className="absolute top-10 left-10 z-20 opacity-10 hidden md:grid grid-cols-5 gap-2">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Logo/Header */}
                    <div className="relative z-30 pt-16 px-12 md:px-20 text-center">
                        <div className="inline-block relative">
                            <h1 className="text-7xl font-black text-slate-100 tracking-tight">{t("Exotic Pet's")}</h1>
                            <p className="text-sm font-bold text-emerald-500 uppercase tracking-[0.3em] mt-2">
                                {t('pets foods & Accessories')}
                            </p>
                        </div>
                    </div>

                    {/* Invoice Banner */}
                    <div className="relative z-30 mt-10 px-12 md:px-20 text-center">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 inline-block px-12 py-3 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-black text-emerald-500 uppercase tracking-widest">{t('Digital Invoice')}</h2>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="relative z-30 mt-12 px-12 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-100">
                        <div className="vibrant-card p-8 rounded-3xl !backdrop-blur-sm border border-slate-800 bg-slate-800/20">
                            <h3 className="text-xs font-black mb-4 uppercase tracking-[0.2em] text-emerald-500">{t('From Store')}</h3>
                            <div className="space-y-1 text-slate-200">
                                <p className="font-black text-xl text-slate-100">{t('Exotic Pets Paradise')}</p>
                                <p className="font-bold text-slate-400">{t('Official Store Office')}</p>
                                <p className="font-medium text-slate-500">{t('123 Jungle Road, Pet City')}</p>
                                <p className="font-black mt-2 text-xl text-emerald-400">+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="vibrant-card p-8 rounded-3xl !backdrop-blur-sm border border-slate-800 bg-slate-800/20">
                            <h3 className="text-xs font-black mb-4 uppercase tracking-[0.2em] text-emerald-500">{t('Bill To')}</h3>
                            <div className="space-y-2 text-slate-200">
                                <p className="font-black text-xl flex items-center gap-2 text-slate-100">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                    {order.customerName || order.userId?.name || t('Valued Customer')}
                                </p>
                                <p className="font-medium text-slate-400 leading-relaxed pl-3.5 border-l-2 border-slate-800">
                                    {order.deliveryAddress}
                                </p>
                                <p className="font-black text-lg pl-3.5 text-emerald-400">
                                    {order.phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative z-30 mt-12 px-12 md:px-20 flex-grow">
                        <div className="overflow-hidden rounded-2xl border border-slate-800">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950 text-slate-100">
                                    <tr className="text-sm font-black uppercase tracking-widest">
                                        <th className="py-6 px-8 w-1/2">{t('Item Description')}</th>
                                        <th className="py-6 px-4 text-center">{t('Unit Price')}</th>
                                        <th className="py-6 px-4 text-center">{t('Qty')}</th>
                                        <th className="py-6 px-8 text-right">{t('Amount')}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-300">
                                    {order.products.map((item, i) => (
                                        <tr key={i} className={`text-lg font-bold ${i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/30'}`}>
                                            <td className="py-6 px-8 border-b border-slate-800">
                                                <span className="block text-xl font-black text-slate-100">{t(item.petId?.name) || t('Exotic Animal Adoption')}</span>
                                                {item.petId?.category && (
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        {t(item.petId.category)} {item.petId.breed && `• ${t(item.petId.breed)}`}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-6 px-4 text-center border-b border-slate-800">₹{item.price}</td>
                                            <td className="py-6 px-4 text-center border-b border-slate-800">{item.quantity}</td>
                                            <td className="py-6 px-8 text-right border-b border-slate-800 font-black text-emerald-400">₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="relative z-30 mt-12 px-12 md:px-20 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                        <div className="bg-slate-950/50 p-8 rounded-3xl border border-dashed border-slate-700">
                            <h4 className="text-xs font-black mb-4 uppercase tracking-widest text-slate-500">{t('Important Terms')}</h4>
                            <p className="text-slate-400 text-[10px] leading-relaxed font-bold uppercase tracking-tight opacity-60">
                                • {t('Professional health certificate included with all adoptions.')}<br />
                                • {t('48-hour initial adjustment guarantee applies.')}<br />
                                • {t('Live animals requires climate-controlled environment.')}<br />
                                • {t('Support available 24/7 at support@exoticpets.com')}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-lg font-bold text-slate-200 px-4">
                                <span className="text-slate-500 uppercase text-xs tracking-widest">{t('Subtotal')}</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-slate-200 px-4">
                                <span className="text-slate-500 uppercase text-xs tracking-widest">{t('Platform Fee')}</span>
                                <span className="text-emerald-500">{t('FREE')}</span>
                            </div>
                            <div className="bg-emerald-600 p-6 rounded-2xl flex justify-between items-center text-white shadow-lg shadow-emerald-900/40">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{t('Total Payable')}</span>
                                    <span className="text-3xl font-black italic">{t('INR Capital')}</span>
                                </div>
                                <span className="text-4xl font-black">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Accent */}
                    <div className="absolute bottom-0 left-0 w-full h-[140px] overflow-hidden z-0">
                        <div className="absolute bottom-[-50px] left-[-5%] w-[110%] h-[120px] bg-slate-950 rotate-1 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]" />
                        <div className="absolute bottom-5 right-10 text-slate-100 font-black text-6xl italic z-10 pointer-events-none opacity-10">
                            {t('THANK YOU')}
                        </div>
                    </div>

                </div>
            </div>

            {/* Print Specific CSS */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700;900&display=swap');
                
                .font-serif { font-family: 'Roboto Slab', serif; }

                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0; padding: 0; color: black !important; }
                    .printable-area { padding: 0 !important; background: white !important; }
                    #invoice-capture { 
                        background: white !important; 
                        border: none !important; 
                        width: 100%; 
                        height: auto; 
                        color: black !important;
                        box-shadow: none !important;
                    }
                    /* Reset colors for print */
                    .bg-slate-900, .bg-slate-950, .bg-slate-800, .bg-slate-800/20, .bg-slate-800/30, .bg-slate-950/50, .bg-slate-900/20 { background: white !important; }
                    .text-slate-100, .text-slate-200, .text-slate-300, .text-slate-400, .text-slate-500 { color: #1e293b !important; }
                    .text-emerald-500, .text-emerald-400 { color: #059669 !important; }
                    .bg-emerald-500, .bg-emerald-600 { background: #10b981 !important; color: white !important; }
                    .border-slate-800, .border-slate-700 { border-color: #e2e8f0 !important; }
                    
                    /* Decorative shapes adjustment for print */
                    .bg-slate-950 { background: #0f172a !important; } /* Keep some contrast in the header */
                    .bg-slate-900 { background: white !important; }
                    
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}} />
        </div>
    );
};

export default OrderDetails;
