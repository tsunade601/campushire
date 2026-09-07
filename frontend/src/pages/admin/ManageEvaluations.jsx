import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import { ClipboardCheck, Plus, Star } from 'lucide-react';

export default function ManageEvaluations() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    internship_record_id: '',
    evaluated_by: 'Academic Mentor',
    technical_score: 5,
    communication_score: 4,
    punctuality_score: 5,
    problem_solving_score: 5,
    ppo_offered: true,
    qualitative_feedback: 'Demonstrated exceptional competence and dedication.'
  });

  const loadRecords = async () => {
    try {
      const res = await api.listRecords();
      setRecords(res.data || []);
      if (res.data && res.data.length > 0) {
        setFormData(prev => ({ ...prev, internship_record_id: res.data[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createEvaluation({
        ...formData,
        internship_record_id: parseInt(formData.internship_record_id, 10),
        technical_score: parseInt(formData.technical_score, 10),
        communication_score: parseInt(formData.communication_score, 10),
        punctuality_score: parseInt(formData.punctuality_score, 10),
        problem_solving_score: parseInt(formData.problem_solving_score, 10)
      });
      setIsModalOpen(false);
      loadRecords();
    } catch (err) {
      alert(err.message || 'Error recording evaluation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Performance Appraisals &amp; PPOs</h1>
            <p className="text-xs text-slate-400 mt-1">Multi-dimensional evaluation (1 - 5) and Pre-Placement Offer recommendations.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" /> Record Evaluation
          </button>
        </div>

        <div className="space-y-4">
          {records.map((rec) => (
            <div key={rec.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{rec.student_name} ({rec.roll_number})</h3>
                  <p className="text-xs text-brand-400">{rec.company_name} — {rec.role_title}</p>
                </div>
                {rec.overall_score ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1 text-sm bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    <Star className="w-4 h-4 fill-current" /> {rec.overall_score} / 5.00
                  </span>
                ) : (
                  <span className="text-slate-500 text-xs italic">Awaiting Evaluation</span>
                )}
              </div>

              {rec.ppo_offered && (
                <div className="inline-block px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  🌟 Pre-Placement Offer (PPO) Recommended
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Student Appraisal">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Internship Record</label>
              <select
                value={formData.internship_record_id}
                onChange={(e) => setFormData({ ...formData, internship_record_id: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.student_name} ({r.roll_number}) — {r.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Technical Score (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.technical_score}
                  onChange={(e) => setFormData({ ...formData, technical_score: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Communication Score (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.communication_score}
                  onChange={(e) => setFormData({ ...formData, communication_score: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Punctuality Score (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.punctuality_score}
                  onChange={(e) => setFormData({ ...formData, punctuality_score: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Problem Solving (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.problem_solving_score}
                  onChange={(e) => setFormData({ ...formData, problem_solving_score: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ppo"
                checked={formData.ppo_offered}
                onChange={(e) => setFormData({ ...formData, ppo_offered: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-brand-500"
              />
              <label htmlFor="ppo" className="text-xs text-white font-semibold">Recommend for Pre-Placement Offer (PPO)</label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Qualitative Feedback</label>
              <textarea
                rows={3}
                value={formData.qualitative_feedback}
                onChange={(e) => setFormData({ ...formData, qualitative_feedback: e.target.value })}
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
                Submit Appraisal
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
