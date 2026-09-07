import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import Badge from '../../components/Badge';
import { Search, Filter, MapPin, Calendar, Clock, DollarSign, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InternshipList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [workMode, setWorkMode] = useState(searchParams.get('work_mode') || '');
  const [minStipend, setMinStipend] = useState(searchParams.get('min_stipend') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'deadline');

  const fetchInternships = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        search,
        work_mode: workMode,
        min_stipend: minStipend,
        sort_by: sortBy,
        status: 'Open'
      };
      const res = await api.listInternships(params);
      setInternships(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 9, total: 0, pages: 1 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships(1);
  }, [workMode, minStipend, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Explore Internship Opportunities</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search across corporate recruiters with relational filtering on stipend, required skills, work mode, and application deadlines.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search role, skills, or company..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Work Mode */}
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="">All Work Modes</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Min Stipend */}
          <select
            value={minStipend}
            onChange={(e) => setMinStipend(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="">Any Stipend</option>
            <option value="50000">₹50,000+/mo</option>
            <option value="80000">₹80,000+/mo</option>
            <option value="100000">₹100,000+/mo</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="deadline">Approaching Deadline</option>
            <option value="stipend">Highest Stipend</option>
            <option value="created">Newly Listed</option>
          </select>
        </div>
      </div>

      {/* Grid of Internships */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading internships...</div>
      ) : internships.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <p className="text-slate-300 font-semibold text-base">No open internships matching your query.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((job) => (
            <div key={job.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider block truncate max-w-[180px]">
                      {job.company_name}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-brand-300 line-clamp-1">
                      {job.title}
                    </h3>
                  </div>
                  <Badge status={job.work_mode}>{job.work_mode}</Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {job.duration_weeks} wks</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mt-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.skills && job.skills.slice(0, 3).map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                      {s.name}
                    </span>
                  ))}
                  {job.skills && job.skills.length > 3 && (
                    <span className="text-[10px] text-slate-500 self-center">+{job.skills.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold block">Monthly Stipend</span>
                  <span className="text-sm font-bold text-emerald-400">₹{Number(job.stipend_amount).toLocaleString()}</span>
                </div>
                <Link
                  to={`/internships/${job.id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-brand-500 hover:text-white transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchInternships(pagination.page - 1)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 px-3">
            Page <strong className="text-white">{pagination.page}</strong> of {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchInternships(pagination.page + 1)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
