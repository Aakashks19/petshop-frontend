import { PawPrint, Mail, Phone, MapPin, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-[#0f172a] text-gray-300 pt-24 pb-12 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-center md:text-left">

                    {/* About Us Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center justify-center md:justify-start gap-2 group">
                            <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-all">
                                <PawPrint className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent uppercase tracking-tight">
                                {t("Exotic Pet's")}
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {t('About Us Description')}
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                <Github size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h4 className="text-white font-bold mb-8 text-lg uppercase tracking-widest">{t('Contact Support')}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center justify-center md:justify-start gap-4 group">
                                <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-emerald-600 transition-colors">
                                    <Mail size={18} className="text-emerald-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-black text-slate-500 tracking-tighter">{t('Email Support')}</p>
                                    <p className="font-bold text-slate-200">support@exoticpets.com</p>
                                    <p className="text-[10px] text-slate-500 italic">{t('Avg. response: 2 hours')}</p>
                                </div>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-4 group">
                                <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-emerald-600 transition-colors">
                                    <Phone size={18} className="text-emerald-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-black text-slate-500 tracking-tighter">{t('24/7 Helpline')}</p>
                                    <p className="font-bold text-slate-200">+91 98765 43210</p>
                                    <p className="text-[10px] text-slate-500 italic">{t('Emergency vet calls only at night')}</p>
                                </div>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-4 group">
                                <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-emerald-600 transition-colors">
                                    <MapPin size={18} className="text-emerald-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-black text-slate-500 tracking-tighter">{t('Flagship Store')}</p>
                                    <p className="font-bold text-slate-200">123 Jungle Road, Pet City</p>
                                    <p className="text-[10px] text-slate-500">{t('Karnataka, India 560001')}</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Care Guides */}
                    <div>
                        <h4 className="text-white font-bold mb-8 text-lg uppercase tracking-widest">{t('Adoption Care')}</h4>
                        <ul className="space-y-3">
                            {[
                                { name: t('Habitat Setup Guide'), desc: t('Light, Heat & Space requirements') },
                                { name: t('Avian Nutrition 101'), desc: t('Seed vs Pellet diets') },
                                { name: t('Aquarium Cycling'), desc: t('The nitrogen cycle basics') },
                                { name: t('Exotic Mammals'), desc: t('Socialization & Handling') },
                                { name: t('Vet Directory'), desc: t('Find specialized exotic vets') }
                            ].map((guide, i) => (
                                <li key={i}>
                                    <a href="#" className="flex flex-col items-center md:items-start hover:text-white transition-colors group">
                                        <span className="font-bold text-slate-300 group-hover:text-emerald-400">{guide.name}</span>
                                        <span className="text-[10px] text-slate-500 font-medium">{guide.desc}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shipping Policy */}
                    <div className="vibrant-card p-8 border-white/10 !bg-white/5 !backdrop-blur-lg">
                        <h4 className="text-white font-bold mb-4 text-lg">{t('Shipping Excellence')}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6 font-medium">
                            {t('Shipping Detail Desc')}
                        </p>
                        <div className="space-y-2">
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
                            <span className="bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black text-center text-white uppercase tracking-widest shadow-lg shadow-emerald-900/25">
                                {t('Safe Arrival Guarantee')}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium">
                    <p className="text-slate-500">
                        {t('All rights reserved')}
                    </p>
                    <div className="flex gap-8 text-slate-500">
                        <a href="#" className="hover:text-white">{t('Privacy Policy')}</a>
                        <a href="#" className="hover:text-white">{t('Terms of Service')}</a>
                        <a href="#" className="hover:text-white">{t('FAQs')}</a>
                    </div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </footer>
    );
};

export default Footer;
