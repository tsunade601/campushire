import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import { CheckCircle2, Star, Award, Building2, Calendar } from 'lucide-react';

export default function InternshipHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.listRecords();
        setRecords(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="student" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white">Internship Records &amp; Evaluations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracked records of ongoing/completed internships with corporate supervisor ratings and Pre-Placement Offer (PPO) recommendations.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
            <p className="text-sm font-semibold text-slate-300">No active or completed internship records found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((rec) => (
              <div key={rec.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{rec.company_name}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{rec.role_title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Duration: {new Date(rec.official_start_date).toLocaleDateString()} — {new Date(rec.official_end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge status={rec.status}>{rec.status}</Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-slate-400 block">Assigned Supervisor</span>
                    <strong className="text-white">{rec.supervisor_name}</strong> ({rec.supervisor_email})
                  </div>
                  {rec.overall_score && (
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-slate-400 block">Evaluation Score</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" /> {rec.overall_score} / 5.00
                        </span>
                      </div>
                      {rec.ppo_offered && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                          🎉 PPO Offered!
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {rec.completion_notes && (
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Completion Notes:</strong> {rec.completion_notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
