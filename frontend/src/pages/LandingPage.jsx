import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Briefcase, Building2, ShieldCheck, Database, 
  ArrowRight, CheckCircle2, TrendingUp, Users, Award, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/Badge';

export default function LandingPage() {
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [stats, setStats] = useState({ companies: 7, internships: 9, students: 7, placementPct: 85 });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.listInternships({ limit: 4 });
        if (res.data) setFeaturedInternships(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Hero Section with animated gradients */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background glow discs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-500/30 text-xs font-semibold text-brand-300 mb-8 animate-fade-in shadow-lg shadow-brand-500/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>DBMS Academic Project • 3NF Normalized MySQL 8.0</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] animate-slide-up">
            University Recruitment &amp; Internships,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-sky-300 to-emerald-400">
              Engineered with Integrity.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed animate-slide-up">
            A comprehensive, relational database platform powering student applications, verified skill catalogs, corporate interviews, offers, and performance appraisals.
          </p>

          {/* Call to action buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              to="/internships"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" /> Explore Open Roles
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold glass-panel border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white transition-all hover:bg-slate-800/80 flex items-center justify-center gap-2"
            >
              Sign In (Demo Accounts) <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-white">200+</p>
              <p className="text-xs text-slate-400 mt-1">Corporate Partners</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-emerald-400">500+</p>
              <p className="text-xs text-slate-400 mt-1">Internship Postings</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-brand-400">2,000+</p>
              <p className="text-xs text-slate-400 mt-1">Registered Students</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-400">92.4%</p>
              <p className="text-xs text-slate-400 mt-1">Placement Conversion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Lifecycle Section */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Complete Recruitment State Machine</h2>
            <p className="text-slate-400 text-sm mt-2">
              Every stage is governed by relational foreign keys and ACID transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-4 border border-blue-500/20">
                1
              </div>
              <h3 className="text-lg font-semibold text-white">Profile &amp; Skills</h3>
              <p className="text-xs text-slate-400 mt-2">
                Students maintain education records, verified CGPA bounds (0-10), and atomic skill proficiency mappings.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-4 border border-purple-500/20">
                2
              </div>
              <h3 className="text-lg font-semibold text-white">Discovery &amp; Apply</h3>
              <p className="text-xs text-slate-400 mt-2">
                Multi-faceted filtering across industry, mode, stipend, and skills with database-level duplicate prevention.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-4 border border-amber-500/20">
                3
              </div>
              <h3 className="text-lg font-semibold text-white">Interviews &amp; Rounds</h3>
              <p className="text-xs text-slate-400 mt-2">
                Technical, Managerial, and HR interview tracking with ratings, links, feedback, and chronological logs.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4 border border-emerald-500/20">
                4
              </div>
              <h3 className="text-lg font-semibold text-white">Offers &amp; PPO Appraisal</h3>
              <p className="text-xs text-slate-400 mt-2">
                Atomic offer acceptance triggers internship record provisioning, supervisor grading, and PPO recommendation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      {featuredInternships.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Open Roles</h2>
              <p className="text-xs text-slate-400 mt-1">Actively hiring partner companies</p>
            </div>
            <Link to="/internships" className="text-sm font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View All Postings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredInternships.map((job) => (
              <div key={job.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{job.company_name}</span>
                      <h3 className="text-lg font-bold text-white mt-1 group-hover:text-brand-300">{job.title}</h3>
                    </div>
                    <Badge status={job.work_mode}>{job.work_mode}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-3">{job.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.skills && job.skills.slice(0, 3).map((s) => (
                      <span key={s.id} className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400">Monthly Stipend</span>
                    <p className="text-sm font-bold text-emerald-400">₹{Number(job.stipend_amount).toLocaleString()}</p>
                  </div>
                  <Link
                    to={`/internships/${job.id}`}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-brand-500 hover:text-white transition-all text-slate-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
