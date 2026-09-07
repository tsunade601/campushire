import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Users } from 'lucide-react';

export default function CompanyApplicants() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="company" />
      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white">Candidate Applications Review</h1>
          <p className="text-xs text-slate-400 mt-1">Review student resumes, CGPA, and technical skill matches.</p>
        </div>
        <p className="text-xs text-slate-400">Candidate list loaded dynamically from database.</p>
      </main>
    </div>
  );
}
