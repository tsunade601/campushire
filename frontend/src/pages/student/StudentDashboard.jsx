import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import { FileText, Calendar, Gift, CheckCircle, ArrowRight, Clock, Building2 } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getStudentDashboard();
        setDashboardData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = dashboardData?.stats || { total_applied: 0, in_review: 0, shortlisted: 0, interview_count: 0, offers_count: 0, accepted_count: 0 };
  const interviews = dashboardData?.upcomingInterviews || [];
  const offers = dashboardData?.activeOffers || [];
  const recentApps = dashboardData?.recentApplications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="student" />

      <main className="flex-1 min-w-0 space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="max-w-xl">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Student Career Console</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Welcome back, {user?.student?.first_name || 'Student'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Track your internship applications, attend scheduled interview rounds, and manage recruitment offers.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Applications" value={stats.total_applied} subtitle="Total submitted" icon={FileText} color="brand" />
          <StatCard title="Interviews" value={stats.interview_count} subtitle="Scheduled rounds" icon={Calendar} color="purple" />
          <StatCard title="Offers Issued" value={stats.offers_count} subtitle="Action required" icon={Gift} color="emerald" />
          <StatCard title="Offers Accepted" value={stats.accepted_count} subtitle="Placed records" icon={CheckCircle} color="amber" />
        </div>

        {/* Active Offers Alert Banner if any */}
        {offers.length > 0 && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 animate-scale-in">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-300">You have {offers.length} active offer(s) pending response!</h4>
                <p className="text-xs text-slate-300 mt-0.5">Review terms, stipend, and accept or decline before the offer deadline.</p>
              </div>
            </div>
            <Link
              to="/student/offers"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              Review Offers
            </Link>
          </div>
        )}

        {/* Grid: Upcoming Interviews + Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Interviews */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" /> Upcoming Interviews
              </h3>
              <Link to="/student/interviews" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
                View All
              </Link>
            </div>

            {interviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No upcoming interviews scheduled at this time.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((inv) => (
                  <div key={inv.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wide">{inv.company_name}</span>
                      <p className="text-xs font-bold text-white mt-0.5">{inv.round_type}</p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(inv.scheduled_at).toLocaleDateString()} at {new Date(inv.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge status="Interview Scheduled">Scheduled</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" /> Recent Applications
              </h3>
              <Link to="/student/applications" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
                View All
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400 mb-3">You have not applied to any internships yet.</p>
                <Link to="/internships" className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-500 text-white">
                  Browse Roles
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => (
                  <div key={app.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">{app.company_name}</span>
                      <p className="text-xs font-bold text-white mt-0.5">{app.title}</p>
                      <p className="text-[11px] text-emerald-400 font-semibold mt-1">₹{Number(app.stipend_amount).toLocaleString()}/mo</p>
                    </div>
                    <Badge status={app.status}>{app.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
