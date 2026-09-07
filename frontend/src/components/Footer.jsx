import React from 'react';
import { Database, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-300">
            CampusHire &copy; 2026 — Student Internship &amp; Recruitment Management System
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Designed for University Placement Cells • 3NF Normalized Relational Database Architecture
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="inline-flex items-center gap-1 text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/20">
            <Database className="w-3.5 h-3.5" /> MySQL 8.0 InnoDB
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> ACID Transactions
          </span>
          <span className="inline-flex items-center gap-1 text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
            <Cpu className="w-3.5 h-3.5" /> Express REST API
          </span>
        </div>
      </div>
    </footer>
  );
}
