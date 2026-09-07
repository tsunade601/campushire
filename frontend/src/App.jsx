import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentSkills from './pages/student/StudentSkills';
import InternshipList from './pages/student/InternshipList';
import InternshipDetail from './pages/student/InternshipDetail';
import MyApplications from './pages/student/MyApplications';
import InterviewSchedule from './pages/student/InterviewSchedule';
import OffersPage from './pages/student/OffersPage';
import InternshipHistory from './pages/student/InternshipHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageCompanies from './pages/admin/ManageCompanies';
import ManageInternships from './pages/admin/ManageInternships';
import ManageApplications from './pages/admin/ManageApplications';
import ScheduleInterviews from './pages/admin/ScheduleInterviews';
import ManageOffers from './pages/admin/ManageOffers';
import InternshipRecords from './pages/admin/InternshipRecords';
import ManageEvaluations from './pages/admin/ManageEvaluations';
import AnalyticsPage from './pages/admin/AnalyticsPage';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyPostings from './pages/company/CompanyPostings';
import CompanyApplicants from './pages/company/CompanyApplicants';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Verifying session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <Navbar />

        <div className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/internships" element={<InternshipList />} />
            <Route path="/internships/:id" element={<InternshipDetail />} />

            {/* Student */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/skills" element={<ProtectedRoute allowedRoles={['student']}><StudentSkills /></ProtectedRoute>} />
            <Route path="/student/applications" element={<ProtectedRoute allowedRoles={['student']}><MyApplications /></ProtectedRoute>} />
            <Route path="/student/interviews" element={<ProtectedRoute allowedRoles={['student']}><InterviewSchedule /></ProtectedRoute>} />
            <Route path="/student/offers" element={<ProtectedRoute allowedRoles={['student']}><OffersPage /></ProtectedRoute>} />
            <Route path="/student/history" element={<ProtectedRoute allowedRoles={['student']}><InternshipHistory /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><ManageStudents /></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><ManageCompanies /></ProtectedRoute>} />
            <Route path="/admin/internships" element={<ProtectedRoute allowedRoles={['admin']}><ManageInternships /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute allowedRoles={['admin']}><ManageApplications /></ProtectedRoute>} />
            <Route path="/admin/interviews" element={<ProtectedRoute allowedRoles={['admin']}><ScheduleInterviews /></ProtectedRoute>} />
            <Route path="/admin/offers" element={<ProtectedRoute allowedRoles={['admin']}><ManageOffers /></ProtectedRoute>} />
            <Route path="/admin/records" element={<ProtectedRoute allowedRoles={['admin']}><InternshipRecords /></ProtectedRoute>} />
            <Route path="/admin/evaluations" element={<ProtectedRoute allowedRoles={['admin']}><ManageEvaluations /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AnalyticsPage /></ProtectedRoute>} />

            {/* Company */}
            <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
            <Route path="/company/postings" element={<ProtectedRoute allowedRoles={['company']}><CompanyPostings /></ProtectedRoute>} />
            <Route path="/company/applicants" element={<ProtectedRoute allowedRoles={['company']}><CompanyApplicants /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </AuthProvider>
  );
}
