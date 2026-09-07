import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { MapPin, Clock, DollarSign, Calendar, Users, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InternshipDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadDetail = async () => {
    try {
      const res = await api.getInternship(id);
      setInternship(res.internship);
      if (user?.student?.resume_url) {
        setResumeUrl(user.student.resume_url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.applyInternship(id, { cover_letter: coverLetter, resume_url: resumeUrl });
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        navigate('/student/applications');
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to apply.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading posting details...</div>;
  if (!internship) return <div className="p-12 text-center text-slate-400">Internship not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">{internship.company_name}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">{internship.title}</h1>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-3">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {internship.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {internship.duration_weeks} weeks</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {internship.openings} opening(s)</span>
            </p>
          </div>

          <div className="text-right sm:flex-shrink-0 flex flex-col items-end gap-2">
            <Badge status={internship.work_mode} size="lg">{internship.work_mode}</Badge>
            <p className="text-xl font-extrabold text-emerald-400 mt-1">₹{Number(internship.stipend_amount).toLocaleString()}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
          </div>
        </div>

        {/* Application CTA Button */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Deadline: <strong className="text-white">{new Date(internship.deadline).toLocaleDateString()}</strong> ({internship.days_left >= 0 ? `${internship.days_left} days left` : 'Expired'})
          </span>

          {internship.hasApplied ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Applied ({internship.userApplication?.status})
            </div>
          ) : user?.role === 'student' ? (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              disabled={internship.days_left < 0 || internship.status !== 'Open'}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 disabled:opacity-40"
            >
              Apply Now
            </button>
          ) : (
            <Link to="/login" className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white">
              Log in as Student to Apply
            </Link>
          )}
        </div>
      </div>

      {/* Description & Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Role Overview</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{internship.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-2">Requirements &amp; Eligibility</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{internship.requirements}</p>
          </div>
        </div>

        {/* Skills sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Target Skills Required</h3>
          <div className="space-y-2">
            {internship.skills && internship.skills.map((s) => (
              <div key={s.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">{s.name}</span>
                <span className={`text-[10px] font-semibold ${s.is_required ? 'text-rose-400' : 'text-slate-400'}`}>
                  {s.is_required ? 'Mandatory' : 'Preferred'}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase">Recruiter Information</h4>
            <p className="text-xs text-white font-medium mt-1">{internship.company_name}</p>
            <p className="text-[11px] text-slate-400">{internship.company_city}, India</p>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${internship.title}`}
      >
        {applySuccess ? (
          <div className="text-center py-8 text-emerald-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm font-bold">Application Submitted Successfully!</p>
            <p className="text-xs text-slate-400 mt-1">Redirecting to your applications tracking tab...</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Resume Link (PDF URL)</label>
              <input
                type="url"
                required
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://campushire.edu/resumes/myresume.pdf"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Note / Why are you a good fit?</label>
              <textarea
                rows={4}
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Detail your relevant coursework, projects, or matching skills..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
