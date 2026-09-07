import React from 'react';

const statusConfig = {
  // Application statuses
  'Applied': { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Under Review': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Shortlisted': { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Interview Scheduled': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Offered': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Accepted': { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/40' },
  'Declined': { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Rejected': { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Withdrawn': { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' },

  // Internship posting status
  'Open': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Draft': { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' },
  'Closed': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Archived': { bg: 'bg-slate-700/30', text: 'text-slate-400', border: 'border-slate-600/40' },

  // Work modes
  'Remote': { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30' },
  'Hybrid': { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30' },
  'On-site': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },

  // Proficiency
  'Beginner': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'Intermediate': { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Advanced': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
  'Expert': { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },

  // Default
  'default': { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' }
};

export default function Badge({ children, status, size = 'md', className = '' }) {
  const key = status || children;
  const config = statusConfig[key] || statusConfig['default'];
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
      ? 'px-3.5 py-1 text-sm' 
      : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border transition-all duration-200 ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}
