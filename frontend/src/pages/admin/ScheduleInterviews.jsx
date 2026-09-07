import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Calendar, Plus, Video, Clock } from 'lucide-react';

export default function ScheduleInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    application_id: '',
    round_number: 1,
    round_type: 'Technical Round 1',
    scheduled_at: '2026-09-15T14:00',
    duration_minutes: 45,
    location_or_link: 'https://meet.google.com/xyz-campushire',
    interviewer_name: 'Campus Technical Panel'
  });

  const loadData = async () => {
    try {
      const [invRes, appRes] = await Promise.all([
        api.listInterviews(),
        api.listApplications({ status: 'Shortlisted' })
      ]);
      setInterviews(invRes.data || []);
      setApplications(appRes.data || []);
      if (appRes.data && appRes.data.length > 0) {
        setFormData(prev => ({ ...prev, application_id: appRes.data[0].id }));
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

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await api.scheduleInterview({
        ...formData,
        application_id: parseInt(formData.application_id, 10),
        round_number: parseInt(formData.round_number, 10),
        duration_minutes: parseInt(formData.duration_minutes, 10)
      });
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to schedule.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Interview Coordination Panel</h1>
            <p className="text-xs text-slate-400 mt-1">Schedule online/offline assessment rounds and record interviewer verdicts.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" /> Schedule New Round
          </button>
        </div>

        <div className="space-y-4">
          {interviews.map((inv) => (
            <div key={inv.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{inv.company_name}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{inv.student_name} ({inv.roll_number}) — {inv.round_type}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>{new Date(inv.scheduled_at).toLocaleString()}</span>
                  <span>•</span>
                  <span>{inv.duration_minutes} mins</span>
                  <span>•</span>
                  <span>Panel: {inv.interviewer_name}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge status={inv.result === 'Scheduled' ? 'Interview Scheduled' : inv.result}>{inv.result}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Interview Round">
          <form onSubmit={handleSchedule} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Shortlisted Candidate</label>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Round Type</label>
                <select
                  value={formData.round_type}
                  onChange={(e) => setFormData({ ...formData, round_type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Technical Round 1">Technical Round 1</option>
                  <option value="Technical Round 2">Technical Round 2</option>
                  <option value="Managerial Round">Managerial Round</option>
                  <option value="HR Round">HR Round</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Round Number</label>
                <input
                  type="number"
                  min={1}
                  value={formData.round_number}
                  onChange={(e) => setFormData({ ...formData, round_number: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  required
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Location or Virtual Link</label>
              <input
                type="text"
                required
                value={formData.location_or_link}
                onChange={(e) => setFormData({ ...formData, location_or_link: e.target.value })}
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
                Confirm Schedule
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
