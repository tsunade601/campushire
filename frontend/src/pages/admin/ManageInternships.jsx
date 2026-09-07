import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Briefcase, Plus, Trash2, Edit, MapPin } from 'lucide-react';

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    company_id: 1,
    title: '',
    description: '',
    requirements: '',
    location: 'Bengaluru',
    work_mode: 'Hybrid',
    duration_weeks: 12,
    stipend_amount: 60000,
    openings: 3,
    deadline: '2026-09-30',
    start_date: '2026-10-15',
    end_date: '2027-01-15',
    status: 'Open'
  });

  const loadAll = async () => {
    try {
      const [iRes, cRes] = await Promise.all([
        api.listInternships({ status: 'All', limit: 50 }),
        api.listCompanies()
      ]);
      setInternships(iRes.data || []);
      setCompanies(cRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createInternship(formData);
      setIsModalOpen(false);
      loadAll();
    } catch (err) {
      alert(err.message || 'Failed to create posting.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship posting?')) return;
    try {
      await api.deleteInternship(id);
      loadAll();
    } catch (err) {
      alert(err.message || 'Failed to delete.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Internship Role Postings</h1>
            <p className="text-xs text-slate-400 mt-1">Manage active listings, deadlines, openings, and company affiliations.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" /> Create New Posting
          </button>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">Role Title &amp; Company</th>
                  <th className="px-6 py-4">Work Mode</th>
                  <th className="px-6 py-4">Stipend</th>
                  <th className="px-6 py-4">Openings</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {internships.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/40">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{job.title}</p>
                      <span className="text-[11px] text-brand-400">{job.company_name} • {job.location}</span>
                    </td>
                    <td className="px-6 py-4"><Badge status={job.work_mode}>{job.work_mode}</Badge></td>
                    <td className="px-6 py-4 font-bold text-emerald-400">₹{Number(job.stipend_amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">{job.openings}</td>
                    <td className="px-6 py-4 text-slate-300">{new Date(job.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><Badge status={job.status}>{job.status}</Badge></td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Creating Internship */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Internship Posting">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Company</label>
              <select
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Role Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Work Mode</label>
                <select
                  value={formData.work_mode}
                  onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Stipend</label>
                <input
                  type="number"
                  required
                  value={formData.stipend_amount}
                  onChange={(e) => setFormData({ ...formData, stipend_amount: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Openings</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.openings}
                  onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Application Deadline</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Role Description</label>
              <textarea
                rows={3}
                required
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
                Save &amp; Publish
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
