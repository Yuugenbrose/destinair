const BASE = 'https://destinair-api.destinair-api.workers.dev/api';

function getHeaders(token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

function getToken() {
  return localStorage.getItem('destinair_token');
}

async function request(method, path, body, token) {
  const opts = {
    method,
    headers: getHeaders(token || getToken()),
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  register: (name, email, password) => request('POST', '/auth/register', { name, email, password }),
  getMe: (token) => request('GET', '/auth/me', null, token),

  // Funds
  getFunds: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/funds${qs ? '?' + qs : ''}`);
  },
  getFund: (id) => request('GET', `/funds/${id}`),
  createFund: (data) => request('POST', '/funds', data),
  updateFund: (id, data) => request('PUT', `/funds/${id}`, data),
  deleteFund: (id) => request('DELETE', `/funds/${id}`),
  getFundsImportStatus: () => request('GET', '/funds/import/status'),
  importFunds: (data) => request('POST', '/funds/import', data),

  // Donations / Simulations
  getDonations: () => request('GET', '/donations'),
  createDonation: (data) => request('POST', '/donations', data),
  updateDonation: (id, data) => request('PUT', `/donations/${id}`, data),
  deleteDonation: (id) => request('DELETE', `/donations/${id}`),
  getDonationStats: () => request('GET', '/donations/stats'),

  // Projects
  getProjects: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/projects${qs ? '?' + qs : ''}`);
  },
  getProject: (id) => request('GET', `/projects/${id}`),
  createProject: (data) => request('POST', '/projects', data),
  updateProject: (id, data) => request('PUT', `/projects/${id}`, data),
  deleteProject: (id) => request('DELETE', `/projects/${id}`),

  // Simulator
  simulate: (data) => request('POST', '/simulator/calculate', data),

  // Transparency
  getTransparencyOverview: () => request('GET', '/transparency/overview'),

  // National/state stats (contexto real, curado pelo Admin)
  getNationalStats: () => request('GET', '/stats/national'),
  createNationalStat: (data) => request('POST', '/stats/national', data),
  updateNationalStat: (id, data) => request('PUT', `/stats/national/${id}`, data),
  deleteNationalStat: (id) => request('DELETE', `/stats/national/${id}`),

  // FAQ
  getFaqs: () => request('GET', '/faqs'),

  // Testimonials
  getTestimonials: () => request('GET', '/testimonials'),
};
