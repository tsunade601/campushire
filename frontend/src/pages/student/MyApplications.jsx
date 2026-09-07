import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import { FileText, Calendar, Building2, MapPin } from 'lucide-react';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.listApplications();
        setApplications(res.data || []);
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
          <h1 className="text-2xl font-bold text-white">My Applications Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status updates from campus placement cell and corporate recruiters.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading application records...</div>
        ) : applications.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
            <p className="text-sm font-semibold text-slate-300">You haven't applied to any internships yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{app.company_name}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{app.internship_title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {app.location}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">₹{Number(app.stipend_amount).toLocaleString()}/mo</span>
                    <span>•</span>
                    <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <Badge status={app.status}>{app.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
