const BASE_URL = '/api/v1';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Send and receive session cookies
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      console.error('Network / fetch error:', err);
    }
    throw err;
  }
}

export const api = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    demoLogin: (role) => request('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
    me: () => request('/auth/me'),
    logout: () => request('/auth/logout', { method: 'POST' })
  },

  // Student Profile & Opportunities
  student: {
    getProfile: () => request('/student/profile'),
    updateProfile: (profileData) => request('/student/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
    addSkill: (skill) => request('/student/skills', { method: 'POST', body: JSON.stringify(skill) }),
    removeSkill: (skillName) => request(`/student/skills/${encodeURIComponent(skillName)}`, { method: 'DELETE' }),
    addProject: (project) => request('/student/projects', { method: 'POST', body: JSON.stringify(project) }),
    updateProject: (id, project) => request(`/student/projects/${id}`, { method: 'PUT', body: JSON.stringify(project) }),
    deleteProject: (id) => request(`/student/projects/${id}`, { method: 'DELETE' }),
    getRecommendations: () => request('/student/recommendations'),
    getPublicProfile: (id) => request(`/student/public/${id}`)
  },

  // Recruiter
  recruiter: {
    getProfile: () => request('/recruiter/profile'),
    updateProfile: (data) => request('/recruiter/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getDashboard: () => request('/recruiter/dashboard'),
    getCandidateMatches: (oppId) => request(`/recruiter/matches/${oppId}`),
    getStudents: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/recruiter/students${q ? `?${q}` : ''}`);
    },
    getStudentDetail: (id) => request(`/recruiter/students/${id}`)
  },

  // Opportunities
  opportunities: {
    list: (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.type) query.append('type', params.type);
      if (params.remote !== undefined && params.remote !== '') query.append('remote', params.remote);
      if (params.skill) query.append('skill', params.skill);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      const q = query.toString();
      return request(`/opportunities${q ? `?${q}` : ''}`);
    },
    getById: (id) => request(`/opportunities/${id}`),
    create: (data) => request('/opportunities', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/opportunities/${id}`, { method: 'DELETE' }),
    apply: (id, applicationData) => request(`/opportunities/${id}/apply`, { method: 'POST', body: JSON.stringify(applicationData) })
  },

  // Applications
  applications: {
    listMy: () => request('/applications/my'),
    listForOpportunity: (oppId) => request(`/applications/opportunity/${oppId}`),
    updateStatus: (id, status, feedback) => request(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, feedback }) })
  },

  // Micro Challenges
  challenges: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/challenges${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/challenges/${id}`),
    create: (data) => request('/challenges', { method: 'POST', body: JSON.stringify(data) }),
    submit: (id, submission) => request(`/challenges/${id}/submit`, { method: 'POST', body: JSON.stringify(submission) })
  },

  // Saved & Notifications
  user: {
    getSaved: () => request('/user/saved'),
    saveOpportunity: (id) => request(`/user/saved/${id}`, { method: 'POST' }),
    unsaveOpportunity: (id) => request(`/user/saved/${id}`, { method: 'DELETE' }),
    getNotifications: () => request('/user/notifications'),
    markNotificationRead: (id) => request(`/user/notifications/${id}/read`, { method: 'PUT' })
  },

  // AI Services
  ai: {
    matchScore: (opportunityId) => request('/ai/match-score', { method: 'POST', body: JSON.stringify({ opportunityId }) }),
    resumeReview: (data) => request('/ai/resume-review', { method: 'POST', body: JSON.stringify(data) }),
    gapAnalysis: (targetRole) => request('/ai/gap-analysis', { method: 'POST', body: JSON.stringify({ targetRole }) }),
    interviewPrep: (roleOrTech) => request('/ai/interview-prep', { method: 'POST', body: JSON.stringify({ roleOrTech }) })
  }
};
