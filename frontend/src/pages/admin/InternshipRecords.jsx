import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import { CheckSquare } from 'lucide-react';

export default function InternshipRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.listRecords();
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateRecordStatus(id, status, 'Updated by Placement Cell');
      loadData();
    } catch (e) {
      alert(e.message || 'Error updating status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white">Active &amp; Completed Internship Records</h1>
          <p className="text-xs text-slate-400 mt-1">Official registry of accepted placements and assigned industrial mentors.</p>
        </div>

        <div className="space-y-4">
          {records.map((r) => (
            <div key={r.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{r.company_name}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{r.student_name} ({r.roll_number}) — {r.role_title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Supervisor: <strong className="text-white">{r.supervisor_name}</strong> ({r.supervisor_email}) • Period: {new Date(r.official_start_date).toLocaleDateString()} to {new Date(r.official_end_date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge status={r.status}>{r.status}</Badge>
                {r.status === 'Active' && (
                  <button
                    onClick={() => handleStatusChange(r.id, 'Completed')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
