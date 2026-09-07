import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Gift, Plus } from 'lucide-react';

export default function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    application_id: '',
    stipend_offered: 90000,
    joining_date: '2026-06-01',
    offer_valid_until: '2026-09-30',
    benefits_description: 'Health insurance, hardware allowance, PPO conversion pathway.'
  });

  const loadData = async () => {
    try {
      const [oRes, aRes] = await Promise.all([
        api.listOffers(),
        api.listApplications({ status: 'Shortlisted' })
      ]);
      setOffers(oRes.data || []);
      setApplications(aRes.data || []);
      if (aRes.data && aRes.data.length > 0) {
        setFormData(prev => ({ ...prev, application_id: aRes.data[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createOffer({
        ...formData,
        application_id: parseInt(formData.application_id, 10),
        stipend_offered: parseFloat(formData.stipend_offered)
      });
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Error creating offer.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Issued Recruitment Offers</h1>
            <p className="text-xs text-slate-400 mt-1">Official offers extended to candidates with stipend and joining terms.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" /> Issue New Offer
          </button>
        </div>

        <div className="space-y-4">
          {offers.map((off) => (
            <div key={off.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{off.company_name}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{off.student_name} ({off.roll_number}) — {off.role_title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Stipend: <strong className="text-emerald-400 font-bold">₹{Number(off.stipend_offered).toLocaleString()}/mo</strong> • Joining: {new Date(off.joining_date).toLocaleDateString()} • Valid Until: {new Date(off.offer_valid_until).toLocaleDateString()}
                </p>
              </div>
              <Badge status={off.status}>{off.status}</Badge>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Recruitment Offer">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Selected Candidate</label>
              <select
                value={formData.application_id}
                onChange={(e) => setFormData({ ...formData, application_id: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.student_name} ({a.roll_number}) — {a.internship_title} ({a.company_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Stipend Amount (₹/mo)</label>
                <input
                  type="number"
                  required
                  value={formData.stipend_offered}
                  onChange={(e) => setFormData({ ...formData, stipend_offered: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Joining Date</label>
                <input
                  type="date"
                  required
                  value={formData.joining_date}
                  onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Offer Valid Until</label>
                <input
                  type="date"
                  required
                  value={formData.offer_valid_until}
                  onChange={(e) => setFormData({ ...formData, offer_valid_until: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Perks &amp; Benefits Description</label>
              <textarea
                rows={3}
                value={formData.benefits_description}
                onChange={(e) => setFormData({ ...formData, benefits_description: e.target.value })}
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
                Generate &amp; Dispatch Offer
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
