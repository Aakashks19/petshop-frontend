import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Plus, Edit, Trash, Package, Users, TrendingUp, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { token, isAdmin } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('pets');
    const [pets, setPets] = useState([]);
    const [orders, setOrders] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', category: 'Birds', breed: '', age: '', gender: 'Male',
        pairs: 1,
        medicalStatus: 'Certified',
        vaccinationStatus: 'Fully Vaccinated',
        price: '',
        stock: '',
        description: '',
        images: [],
        featured: false
    });
    const [imageUrlDraft, setImageUrlDraft] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'pets') {
                const { data } = await axios.get(`${API_URL}/api/pets`);
                setPets(data);
            } else {
                const { data } = await axios.get(`${API_URL}/api/orders/admin`);
                setOrders(data);
            }
        } catch (e) {
            toast.error('Failed to fetch data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { ...formData, images: (formData.images || []).filter(Boolean) };
            if (!payload.images.length) {
                toast.error('Please add at least one image');
                return;
            }
            if (editingId) {
                await axios.put(`${API_URL}/api/pets/${editingId}`, payload, config);
                toast.success('Pet updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/pets`, payload, config);
                toast.success('Pet added successfully!');
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({
                name: '', category: 'Birds', breed: '', age: '', gender: 'Male',
                pairs: 1,
                medicalStatus: 'Certified',
                vaccinationStatus: 'Fully Vaccinated',
                price: '',
                stock: '',
                description: '',
                images: [],
                featured: false
            });
            setImageUrlDraft('');
            fetchData();
        } catch (e) {
            toast.error(editingId ? 'Error updating pet' : 'Error adding pet');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this pet?')) return;
        try {
            await axios.delete(`${API_URL}/api/pets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Pet deleted successfully');
            fetchData();
        } catch (e) {
            toast.error('Failed to delete pet');
        }
    };

    const handleEdit = (pet) => {
        setFormData({
            name: pet.name,
            category: pet.category,
            breed: pet.breed || '',
            age: pet.age || '',
            gender: pet.gender || 'Male',
            pairs: Number.isFinite(pet.pairs) ? pet.pairs : 1,
            medicalStatus: pet.medicalStatus || 'Certified',
            vaccinationStatus: pet.vaccinationStatus || 'Fully Vaccinated',
            price: pet.price,
            stock: pet.stock,
            description: pet.description || '',
            images: (pet.images || []).filter(Boolean),
            featured: Boolean(pet.featured)
        });
        setImageUrlDraft('');
        setEditingId(pet._id);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API_URL}/api/orders/${id}/status`, { status });
            toast.success('Order status updated');
            fetchData();
        } catch (e) {
            toast.error('Failed to update status');
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const uploadToast = toast.loading(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}...`);
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const fd = new FormData();
                fd.append('image', file);
                const { data } = await axios.post(`${API_URL}/api/pets/upload`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                });
                if (data?.imageUrl) uploadedUrls.push(data.imageUrl);
            }

            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []).filter(Boolean), ...uploadedUrls]
            }));

            toast.success('Image(s) uploaded successfully', { id: uploadToast });
        } catch (error) {
            toast.error('Failed to upload image(s)', { id: uploadToast });
        } finally {
            // allow uploading same file again
            e.target.value = '';
        }
    };

    const removeImageAt = (index) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    const setMainImage = (index) => {
        setFormData(prev => {
            const imgs = (prev.images || []).filter(Boolean);
            if (index < 0 || index >= imgs.length) return prev;
            const next = [...imgs];
            const [picked] = next.splice(index, 1);
            next.unshift(picked);
            return { ...prev, images: next };
        });
    };

    const addImageUrl = () => {
        const url = imageUrlDraft.trim();
        if (!url) return;
        setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []).filter(Boolean), url]
        }));
        setImageUrlDraft('');
    };

    if (!isAdmin) {
        return (
            <div className="pt-40 pb-20 text-center px-4 text-slate-100">
                <h2 className="text-4xl font-black mb-4">{t('Access denied')}</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest">{t('Admins only')}</p>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: t('Total Sales'), value: '₹45,230', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: t('Active Orders'), value: orders.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: t('Total Pets'), value: pets.length, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
                    ].map((stat, i) => (
                        <div key={i} className="vibrant-card p-8 flex items-center gap-6 card-hover border border-slate-700/50">
                            <div className={`${stat.bg} p-4 rounded-2xl`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-slate-500 font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-100">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="vibrant-card overflow-hidden border border-slate-700/50">
                    <div className="flex border-b border-slate-800 bg-slate-900/40">
                        <button
                            onClick={() => setActiveTab('pets')}
                            className={`flex-1 py-6 font-bold text-lg transition-all ${activeTab === 'pets' ? 'text-emerald-500 border-b-4 border-emerald-500 bg-emerald-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                        >{t('Manage Pets')}</button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex-1 py-6 font-bold text-lg transition-all ${activeTab === 'orders' ? 'text-emerald-500 border-b-4 border-emerald-500 bg-emerald-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                        >{t('Manage Orders')}</button>
                    </div>

                    <div className="p-8 text-slate-100">
                        {activeTab === 'pets' ? (
                            <>
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold">{t('Pets Inventory')}</h2>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <Plus size={20} /> {t('Add New Pet')}
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-slate-500 font-medium border-b border-slate-800">
                                                <th className="pb-4">{t('Pet')}</th>
                                                <th className="pb-4">{t('Category')}</th>
                                                <th className="pb-4">{t('Price')}</th>
                                                <th className="pb-4">{t('Stock')}</th>
                                                <th className="pb-4">{t('Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50 text-slate-300">
                                            {pets.map(pet => (
                                                <tr key={pet._id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="py-4 flex items-center gap-4">
                                                        <img src={pet.images?.[0]} className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800" />
                                                        <span className="font-bold text-slate-200">{t(pet.name)}</span>
                                                    </td>
                                                    <td className="py-4">{t(pet.category)}</td>
                                                    <td className="py-4 font-bold text-emerald-400">₹{pet.price}</td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${pet.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                            {pet.stock} {t('In Stock')}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEdit(pet)}
                                                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(pet._id)}
                                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                                            >
                                                                <Trash size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-500 font-medium border-b border-slate-800">
                                            <th className="pb-4">{t('Order ID')}</th>
                                            <th className="pb-4">{t('Customer')}</th>
                                            <th className="pb-4">{t('Amount')}</th>
                                            <th className="pb-4">{t('Status')}</th>
                                            <th className="pb-4">{t('Action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50 text-slate-300">
                                        {orders.map(order => (
                                            <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="py-6 font-mono text-sm text-emerald-500">#{order._id.slice(-8)}</td>
                                                <td className="py-6">
                                                    <div className="font-bold text-slate-200">{order.userId?.name}</div>
                                                    <div className="text-xs text-slate-500">{order.phone}</div>
                                                </td>
                                                <td className="py-6 font-bold text-emerald-400">₹{order.totalAmount}</td>
                                                <td className="py-6">
                                                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 shadow-sm border border-emerald-500/20">
                                                        {t(order.orderStatus)}
                                                    </span>
                                                </td>
                                                <td className="py-6">
                                                    <select
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        className="text-sm border border-slate-700 bg-slate-900 text-slate-200 rounded-lg p-2 outline-none focus:ring-2 ring-emerald-500/20"
                                                        value={t(order.orderStatus)}
                                                    >
                                                        <option value="Pending">{t('Pending')}</option>
                                                        <option value="Approved">{t('Approved')}</option>
                                                        <option value="Shipped">{t('Shipped')}</option>
                                                        <option value="Delivered">{t('Delivered')}</option>
                                                        <option value="Cancelled">{t('Cancelled')}</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Pet Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="vibrant-card w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-700">
                        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
                            <h2 className="text-2xl font-bold text-slate-100">{editingId ? t('Edit Exotic Pet') : t('Add Exotic Pet')}</h2>
                            <button onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-100"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto bg-slate-900/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Pet Name')}</label>
                                    <input
                                        type="text" required
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Category')}</label>
                                    <select
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Birds">{t('Birds')}</option>
                                        <option value="Mammals">{t('Mammals')}</option>
                                        <option value="Small Animals">{t('Small Animals')}</option>
                                        <option value="Reptiles">{t('Reptiles')}</option>
                                        <option value="Aquarium">{t('Aquarium')}</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Breed')}</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.breed}
                                        onChange={e => setFormData({ ...formData, breed: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Age')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('e.g. 3 Months')}
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.age}
                                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Gender')}</label>
                                    <select
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="Male">{t('Male')}</option>
                                        <option value="Female">{t('Female')}</option>
                                        <option value="Male & Female">{t('Male & Female')}</option>
                                        <option value="Unknown">{t('Unknown')}</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Pairs')}</label>
                                    <select
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.pairs}
                                        onChange={e => setFormData({ ...formData, pairs: Number(e.target.value) })}
                                    >
                                        <option value={1}>{t('1 Pair')}</option>
                                        <option value={2}>{t('2 Pairs')}</option>
                                        <option value={4}>{t('4 Pairs')}</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Medical Status')}</label>
                                    <select
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.medicalStatus}
                                        onChange={e => setFormData({ ...formData, medicalStatus: e.target.value })}
                                    >
                                        <option value="Certified">{t('Certified')}</option>
                                        <option value="Pending">{t('Pending')}</option>
                                        <option value="Not Certified">{t('Not Certified')}</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Vaccination')}</label>
                                    <select
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.vaccinationStatus}
                                        onChange={e => setFormData({ ...formData, vaccinationStatus: e.target.value })}
                                    >
                                        <option value="Fully Vaccinated">{t('Fully Vaccinated')}</option>
                                        <option value="Partially Vaccinated">{t('Partially Vaccinated')}</option>
                                        <option value="Not Vaccinated">{t('Not Vaccinated')}</option>
                                        <option value="Unknown">{t('Unknown')}</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Price (₹)')}</label>
                                    <input
                                        type="number" required
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Stock')}</label>
                                    <input
                                        type="number" required
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Show on Home Carousel')}</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                                        className={`w-full p-4 rounded-2xl border font-bold transition-colors ${formData.featured
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-900/40'
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                            }`}
                                    >
                                        {formData.featured ? t('Featured (Visible on Home)') : t('Not Featured')}
                                    </button>
                                </div>
                                <div className="col-span-full space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Description')}</label>
                                    <textarea
                                        className="w-full p-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 h-32"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-full space-y-4">
                                    <label className="block text-sm font-bold text-slate-400">{t('Pet Images')}</label>
                                    <div className="flex flex-col gap-4">
                                        {(formData.images || []).filter(Boolean).length > 0 ? (
                                            <>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {(formData.images || []).filter(Boolean).map((img, idx) => (
                                                        <div
                                                            key={`${img}-${idx}`}
                                                            className="relative group overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/80 backdrop-blur-sm"
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImageAt(idx)}
                                                                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/80 backdrop-blur text-slate-400 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                                                                aria-label="Remove image"
                                                            >
                                                                <X size={16} />
                                                            </button>

                                                            {idx === 0 && (
                                                                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg">
                                                                    {t('Main')}
                                                                </div>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() => setMainImage(idx)}
                                                                className="block w-full"
                                                                title={t('Set as main image')}
                                                            >
                                                                <img src={img} className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105" alt={`Preview ${idx + 1}`} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors font-bold text-slate-300">
                                                        <Upload className="w-5 h-5 text-emerald-500" />
                                                        {t('Add more photos')}
                                                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                                                    </label>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="relative group flex items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-[2.5rem] hover:border-emerald-500/50 transition-colors bg-slate-900/50">
                                                <label className="cursor-pointer flex flex-col items-center gap-3">
                                                    <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-500">
                                                        <Upload className="w-8 h-8" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-slate-300 text-lg">{t('Click to Upload')}</p>
                                                        <p className="text-sm text-slate-500">{t('You can select multiple photos')}</p>
                                                    </div>
                                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                                                </label>
                                            </div>
                                        )}

                                        {/* Fallback URL Input (adds to list) */}
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    placeholder={t('Or paste image URL here...')}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 text-sm"
                                                    value={imageUrlDraft}
                                                    onChange={e => setImageUrlDraft(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addImageUrl();
                                                        }
                                                    }}
                                                />
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addImageUrl}
                                                className="px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-emerald-900/40 active:scale-95"
                                            >
                                                {t('Add URL')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary py-5 mt-10 text-lg shadow-lg shadow-emerald-900/20">
                                {editingId ? t('Update Pet') : t('Save Pet & Publish')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
