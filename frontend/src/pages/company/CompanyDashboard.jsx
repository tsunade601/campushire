import React from 'react';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { Briefcase, Users, Calendar } from 'lucide-react';

export default function CompanyDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="company" />
      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Corporate Recruiter Console</span>
          <h1 className="text-2xl font-bold text-white mt-1">Company Recruitment Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Review active role postings, candidate shortlists, and scheduled interview rounds.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Active Roles" value={3} subtitle="Open postings" icon={Briefcase} color="brand" />
          <StatCard title="Total Applicants" value={42} subtitle="Student profiles" icon={Users} color="purple" />
          <StatCard title="Interviews" value={8} subtitle="Rounds conducted" icon={Calendar} color="emerald" />
        </div>
      </main>
    </div>
  );
}
