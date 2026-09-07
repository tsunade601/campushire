import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Briefcase, LayoutDashboard, User, LogOut, Menu, X, Shield, Building2 } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Campus<span className="text-brand-400">Hire</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wider uppercase">DBMS Recruitment System</span>
            </div>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/internships"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/internships')
                  ? 'bg-slate-800 text-brand-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Explore Internships
            </Link>

            {user?.role === 'student' && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/student/dashboard')
                      ? 'bg-slate-800 text-brand-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  My Dashboard
                </Link>
                <Link
                  to="/student/applications"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/student/applications')
                      ? 'bg-slate-800 text-brand-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Applications
                </Link>
                <Link
                  to="/student/offers"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/student/offers')
                      ? 'bg-slate-800 text-brand-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Offers
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/admin/dashboard')
                      ? 'bg-slate-800 text-brand-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Admin Portal
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/admin/analytics')
                      ? 'bg-slate-800 text-brand-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Recruitment Analytics
                </Link>
              </>
            )}

            {user?.role === 'company' && (
              <Link
                to="/company/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/company/dashboard')
                    ? 'bg-slate-800 text-brand-400 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Recruiter Portal
              </Link>
            )}
          </div>

          {/* User Auth Pill / Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <Link
                  to={user.role === 'student' ? '/student/profile' : user.role === 'admin' ? '/admin/dashboard' : '/company/dashboard'}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white leading-tight truncate max-w-[120px]">
                      {user.student ? `${user.student.first_name}` : user.email.split('@')[0]}
                    </p>
                    <span className="text-[10px] font-medium text-brand-400 uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-slide-down">
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Explore Internships
          </Link>
          {user?.role === 'student' && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                My Dashboard
              </Link>
              <Link
                to="/student/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Applications
              </Link>
              <Link
                to="/student/offers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Offers
              </Link>
            </>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Admin Portal
            </Link>
          )}
          {user ? (
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-rose-500/10"
            >
              Log Out
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-white"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 rounded-lg text-sm font-semibold bg-brand-500 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
