import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Search, Filter, Mail, Award, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [deptId, setDeptId] = useState('');

  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.listAllStudents({
        page,
        limit: 15,
        search,
        min_cgpa: minCgpa,
        department_id: deptId
      });
      setStudents(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 15, total: 0, pages: 1 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, [deptId, minCgpa]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="admin" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white">Student Roster Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse registered student profiles, academic CGPA records, departments, and application history.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearch} className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or roll number..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">All Departments</option>
              <option value="1">CSE</option>
              <option value="2">IT</option>
              <option value="3">ECE</option>
              <option value="4">EEE</option>
              <option value="5">MECH</option>
              <option value="7">AIDS</option>
            </select>

            <select
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">All CGPA</option>
              <option value="8.0">CGPA ≥ 8.0</option>
              <option value="8.5">CGPA ≥ 8.5</option>
              <option value="9.0">CGPA ≥ 9.0</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Roll Number</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Applications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading student roster...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No students found.</td></tr>
                ) : (
                  students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white text-sm">{st.first_name} {st.last_name}</p>
                        <span className="text-[11px] text-slate-400">{st.email}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-brand-300">{st.roll_number}</td>
                      <td className="px-6 py-4 text-slate-300">{st.department_code}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          {st.cgpa}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{st.batch_year}</td>
                      <td className="px-6 py-4 font-semibold text-purple-400">{st.application_count} applied</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchStudents(pagination.page - 1)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 px-3">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchStudents(pagination.page + 1)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
