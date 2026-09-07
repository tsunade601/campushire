import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { FileText, Edit, CheckCircle2 } from 'lucide-react';

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadApplications = async () => {
    try {
      const res = await api.listApplications({ limit: 50 });
      setApplications(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setUpdating(true);
    try {
      await api.updateApplicationStatus(selectedApp.id, newStatus, notes);
      setSelectedApp(null);
      loadApplications();
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white">Master Applications Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review student submissions, manage candidate status transitions, and forward shortlisted profiles to interview rounds.
          </p>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">Student &amp; Roll</th>
                  <th className="px-6 py-4">Internship Role</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{app.student_name}</p>
                      <span className="text-[11px] text-brand-300 font-mono">{app.roll_number} ({app.department_code})</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">{app.internship_title}</td>
                    <td className="px-6 py-4 text-purple-400 font-semibold">{app.company_name}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400">{app.cgpa}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><Badge status={app.status}>{app.status}</Badge></td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelectedApp(app); setNewStatus(app.status); setNotes(app.notes || ''); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-brand-500 hover:text-white transition-all"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Status Change */}
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Update Status: ${selectedApp?.student_name} (${selectedApp?.roll_number})`}
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offered">Offered</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Administrative Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Candidate cleared initial screening..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
