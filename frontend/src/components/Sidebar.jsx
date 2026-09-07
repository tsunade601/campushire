import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, Award, FileText, Calendar, 
  Gift, CheckCircle, Users, Building2, Briefcase, 
  BarChart3, CheckSquare, ClipboardCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ role = 'student' }) {
  const { user } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'Skills & Tech', path: '/student/skills', icon: Award },
    { name: 'Applications', path: '/student/applications', icon: FileText },
    { name: 'Interviews', path: '/student/interviews', icon: Calendar },
    { name: 'Offers', path: '/student/offers', icon: Gift },
    { name: 'Completed Internships', path: '/student/history', icon: CheckCircle },
  ];

  const adminLinks = [
    { name: 'Overview Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics & 20 Queries', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Recruiting Companies', path: '/admin/companies', icon: Building2 },
    { name: 'Internship Postings', path: '/admin/internships', icon: Briefcase },
    { name: 'Applications Queue', path: '/admin/applications', icon: FileText },
    { name: 'Schedule Interviews', path: '/admin/interviews', icon: Calendar },
    { name: 'Issued Offers', path: '/admin/offers', icon: Gift },
    { name: 'Internship Records', path: '/admin/records', icon: CheckSquare },
    { name: 'Evaluations & PPOs', path: '/admin/evaluations', icon: ClipboardCheck },
  ];

  const companyLinks = [
    { name: 'Company Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
    { name: 'Postings Management', path: '/company/postings', icon: Briefcase },
    { name: 'Applicants Review', path: '/company/applicants', icon: Users },
  ];

  const links = role === 'admin' ? adminLinks : role === 'company' ? companyLinks : studentLinks;

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block pr-6">
      <div className="sticky top-24 glass-panel rounded-2xl p-4 border border-slate-800 shadow-xl space-y-1">
        <div className="px-3 py-2 mb-2">
          <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            {role === 'admin' ? 'Placement Cell Administration' : role === 'company' ? 'Recruiter Console' : 'Student Career Portal'}
          </p>
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
