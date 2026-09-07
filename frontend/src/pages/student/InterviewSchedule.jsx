import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import { Calendar, Clock, Video, User, Star } from 'lucide-react';

export default function InterviewSchedule() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.listInterviews();
        setInterviews(res.data || []);
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
          <h1 className="text-2xl font-bold text-white">Interview Schedule</h1>
          <p className="text-xs text-slate-400 mt-1">
            Selection rounds, online assessment portals, technical interviews, and HR feedback.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading interviews...</div>
        ) : interviews.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
            <p className="text-sm font-semibold text-slate-300">No interview rounds currently scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((inv) => (
              <div key={inv.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{inv.company_name}</span>
                  <h3 className="text-base font-bold text-white">{inv.internship_title} — {inv.round_type}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(inv.scheduled_at).toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {inv.duration_minutes} mins</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {inv.interviewer_name || 'Panel'}</span>
                  </div>
                  {inv.location_or_link && (
                    <div className="pt-1">
                      <a href={inv.location_or_link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" /> Meeting Link / Venue: {inv.location_or_link}
                      </a>
                    </div>
                  )}
                  {inv.feedback && (
                    <p className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 mt-2">
                      <strong className="text-slate-300">Feedback:</strong> {inv.feedback}
                    </p>
                  )}
                </div>

                <div className="sm:text-right flex flex-col sm:items-end justify-between">
                  <Badge status={inv.result === 'Scheduled' ? 'Interview Scheduled' : inv.result}>{inv.result}</Badge>
                  {inv.rating && (
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-2">
                      <Star className="w-3.5 h-3.5 fill-current" /> {inv.rating} / 5
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
