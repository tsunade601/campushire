import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import { Award, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function StudentSkills() {
  const [catalog, setCatalog] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [msg, setMsg] = useState('');

  const loadSkills = async () => {
    try {
      const res = await api.getSkills();
      setCatalog(res.catalog || []);
      setStudentSkills(res.studentSkills || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    try {
      await api.addSkill(selectedSkillId, proficiency);
      setMsg('Skill added successfully!');
      setTimeout(() => setMsg(''), 3000);
      loadSkills();
    } catch (err) {
      alert(err.message || 'Error adding skill');
    }
  };

  const handleRemove = async (skillId) => {
    try {
      await api.removeSkill(skillId);
      loadSkills();
    } catch (err) {
      alert(err.message || 'Error removing skill');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="student" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white">Skills &amp; Technical Competencies</h1>
          <p className="text-xs text-slate-400 mt-1">
            Standardized competencies mapped directly into recruiter search filters and relational skill-match indexes.
          </p>
        </div>

        {msg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {msg}
          </div>
        )}

        {/* Add Skill Widget */}
        <form onSubmit={handleAdd} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">-- Choose a skill to add --</option>
              {catalog.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedSkillId}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </form>

        {/* Current Student Skills List */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">Your Verified Skills ({studentSkills.length})</h3>
          {studentSkills.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No skills added yet. Add your programming languages and frameworks above.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {studentSkills.map((sk) => (
                <div key={sk.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between group hover:border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-white">{sk.name}</p>
                    <span className="text-[10px] text-slate-400 block">{sk.category}</span>
                    <Badge status={sk.proficiency} size="sm" className="mt-1.5">{sk.proficiency}</Badge>
                  </div>
                  <button
                    onClick={() => handleRemove(sk.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
