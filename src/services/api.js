const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_KEY = 'your-secure-api-key-here-change-in-production';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
});

export const apiService = {
  // User APIs
  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Auth APIs
  async login(email) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    return response.json();
  },

  async getUser(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  async updateUser(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // KYC APIs
  async initiateKyc(userId) {
    const response = await fetch(`${API_BASE_URL}/kyc/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  async retryKyc(userId) {
    const response = await fetch(`${API_BASE_URL}/kyc/retry`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  async getKycStatus(userId) {
    const response = await fetch(`${API_BASE_URL}/kyc/status/${userId}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Accreditation APIs
  async initiateAccreditation(userId) {
    const response = await fetch(`${API_BASE_URL}/accreditation/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  async retryAccreditation(userId) {
    const response = await fetch(`${API_BASE_URL}/accreditation/retry`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
    return response.json();
  },

  async getAccreditationStatus(userId) {
    const response = await fetch(`${API_BASE_URL}/accreditation/status/${userId}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Bank APIs
  async linkBankAccount(bankData) {
    const response = await fetch(`${API_BASE_URL}/bank/link`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bankData)
    });
    return response.json();
  },

  async getBankAccount(userId) {
    const response = await fetch(`${API_BASE_URL}/bank/account/${userId}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  async getBalance(userId) {
    const response = await fetch(`${API_BASE_URL}/bank/balance/${userId}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  async getAuditLogs(userId) {
    const response = await fetch(`${API_BASE_URL}/audit/user/${userId}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  async unlinkBankAccount(userId) {
    const response = await fetch(`${API_BASE_URL}/bank/unlink/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  },

  // Investment APIs
  async makeInvestment(investmentData) {
    const response = await fetch(`${API_BASE_URL}/investments/invest`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(investmentData)
    });
    return response.json();
  },

  async getInvestments(userId) {
    const response = await fetch(`${API_BASE_URL}/investments/list/${userId}`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Audit APIs
  async getAuditLogs(userId) {
    const response = await fetch(`${API_BASE_URL}/audit/user/${userId}`, {
      headers: getHeaders()
    });
    return response.json();
  }
};

export default apiService;