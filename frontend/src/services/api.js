const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('campushire_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (studentData) => request('/auth/register', { method: 'POST', body: studentData }),
  getMe: () => request('/auth/me'),

  // Students
  getStudentProfile: (id) => request(id ? `/students/${id}` : '/students/me'),
  updateStudentProfile: (profile) => request('/students/me', { method: 'PUT', body: profile }),
  getStudentDashboard: () => request('/students/dashboard'),
  getSkills: () => request('/students/skills'),
  addSkill: (skill_id, proficiency) => request('/students/skills', { method: 'POST', body: { skill_id, proficiency } }),
  removeSkill: (skillId) => request(`/students/skills/${skillId}`, { method: 'DELETE' }),
  listAllStudents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/students?${qs}`);
  },

  // Internships
  listInternships: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/internships?${qs}`);
  },
  getInternship: (id) => request(`/internships/${id}`),
  createInternship: (internship) => request('/internships', { method: 'POST', body: internship }),
  updateInternship: (id, updates) => request(`/internships/${id}`, { method: 'PUT', body: updates }),
  deleteInternship: (id) => request(`/internships/${id}`, { method: 'DELETE' }),

  // Applications
  applyInternship: (internshipId, data) => request(`/internships/${internshipId}/apply`, { method: 'POST', body: data }),
  listApplications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/applications?${qs}`);
  },
  getApplicationDetails: (id) => request(`/applications/${id}`),
  updateApplicationStatus: (id, status, notes) => request(`/applications/${id}/status`, { method: 'PATCH', body: { status, notes } }),

  // Interviews
  listInterviews: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/interviews?${qs}`);
  },
  scheduleInterview: (interviewData) => request('/interviews', { method: 'POST', body: interviewData }),
  updateInterviewResult: (id, result, feedback, rating) => request(`/interviews/${id}/result`, { method: 'PATCH', body: { result, feedback, rating } }),

  // Offers
  listOffers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/offers?${qs}`);
  },
  createOffer: (offerData) => request('/offers', { method: 'POST', body: offerData }),
  respondToOffer: (id, action) => request(`/offers/${id}/respond`, { method: 'PATCH', body: { action } }),

  // Records & Evaluations
  listRecords: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/internship-records?${qs}`);
  },
  updateRecordStatus: (id, status, notes) => request(`/internship-records/${id}/status`, { method: 'PATCH', body: { status, completion_notes: notes } }),
  getEvaluation: (recordId) => request(`/evaluations/record/${recordId}`),
  createEvaluation: (evalData) => request('/evaluations', { method: 'POST', body: evalData }),

  // Companies
  listCompanies: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/companies?${qs}`);
  },
  getCompany: (id) => request(`/companies/${id}`),
  createCompany: (company) => request('/companies', { method: 'POST', body: company }),
  updateCompany: (id, updates) => request(`/companies/${id}`, { method: 'PUT', body: updates }),

  // Analytics
  getAnalyticsOverview: () => request('/analytics/overview'),
  getDepartmentStats: () => request('/analytics/departments'),
  getSkillDemandStats: () => request('/analytics/top-skills'),
  getCompanyFunnelStats: () => request('/analytics/companies'),
  getMonthlyTrends: () => request('/analytics/trends'),
};
