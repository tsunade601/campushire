import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import { Building2, Plus, Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry_id: 1,
    website: '',
    city: 'Bengaluru',
    hr_name: '',
    hr_email: '',
    hr_phone: '',
    description: ''
  });

  const loadCompanies = async () => {
    try {
      const res = await api.listCompanies();
      setCompanies(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createCompany({
        ...formData,
        industry_id: parseInt(formData.industry_id, 10)
      });
      setIsModalOpen(false);
      loadCompanies();
    } catch (err) {
      alert(err.message || 'Failed to create company profile.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Partner Companies Directory</h1>
            <p className="text-xs text-slate-400 mt-1">Corporate recruiters and campus placement partners.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" /> Add Partner Company
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div key={c.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{c.name}</h3>
                  <span className="text-xs font-semibold text-brand-400">{c.industry_name}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                  {c.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{c.description || 'Corporate recruitment partner.'}</p>

              <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {c.city}, {c.country}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {c.hr_name} ({c.hr_email})</p>
                <p className="text-brand-300 font-semibold pt-1">{c.total_postings} Total Postings ({c.active_postings} Active)</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Company Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Partner Company">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Industry</label>
                <select
                  value={formData.industry_id}
                  onChange={(e) => setFormData({ ...formData, industry_id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="1">Enterprise Software &amp; Cloud</option>
                  <option value="2">Fintech &amp; Payment Systems</option>
                  <option value="3">E-Commerce &amp; Logistics</option>
                  <option value="4">Healthcare &amp; Biotech Tech</option>
                  <option value="5">Semiconductors &amp; Hardware</option>
                  <option value="6">Automotive &amp; Clean Energy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">HR Representative Name</label>
                <input
                  type="text"
                  required
                  value={formData.hr_name}
                  onChange={(e) => setFormData({ ...formData, hr_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">HR Contact Email</label>
                <input
                  type="email"
                  required
                  value={formData.hr_email}
                  onChange={(e) => setFormData({ ...formData, hr_email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600"
              >
                Register Company
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
