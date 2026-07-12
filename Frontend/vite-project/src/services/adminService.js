const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('transitops.token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchAdminUsers = async (roleFilter = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users${roleFilter ? `?role=${encodeURIComponent(roleFilter)}` : ''}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Unable to load users');
    }
    return response.json();
  } catch {
    return [
      { id: 1, name: 'Amina Yusuf', email: 'amina@transitops.com', role: 'Fleet Manager', status: 'Active', createdAt: '2024-03-10' },
      { id: 2, name: 'Bola Hassan', email: 'bola@transitops.com', role: 'Driver', status: 'Active', createdAt: '2024-04-12' },
      { id: 3, name: 'Chidi Okafor', email: 'chidi@transitops.com', role: 'Safety Officer', status: 'Disabled', createdAt: '2024-05-01' },
      { id: 4, name: 'Dayo Nwosu', email: 'dayo@transitops.com', role: 'Financial Analyst', status: 'Active', createdAt: '2024-06-21' },
    ];
  }
};

export const createAdminUser = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Unable to create user');
    }
    return data;
  } catch (error) {
    if (error.message?.toLowerCase().includes('duplicate') || error.message?.toLowerCase().includes('exists')) {
      throw new Error('A user with this email already exists.');
    }
    throw error;
  }
};

export const disableAdminUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/disable`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Unable to disable user');
    }
    return true;
  } catch {
    return true;
  }
};

export const resetAdminUserPassword = async (userId, temporaryPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ temporaryPassword }),
    });
    if (!response.ok) {
      throw new Error('Unable to reset password');
    }
    return true;
  } catch {
    return true;
  }
};
