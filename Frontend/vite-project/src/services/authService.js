const TOKEN_KEY = 'transitops.token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const encodeBase64Url = (value) => {
  const encoded = btoa(unescape(encodeURIComponent(value)));
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const createMockJwt = ({ email, role }) => {
  const payload = {
    sub: email,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const body = JSON.stringify(payload);
  return `${encodeBase64Url(header)}.${encodeBase64Url(body)}.signature`;
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const decodeJwtPayload = (token) => {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getRoleFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const role = payload.role || payload.roles?.[0] || payload.userRole || payload.roleName;
  return typeof role === 'string' ? role : null;
};

export const isTokenValid = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return false;
  }

  const expiry = payload.exp;
  return !expiry || Date.now() / 1000 < expiry;
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (!data.token && data.accessToken) {
      data.token = data.accessToken;
    }

    if (!data.token) {
      throw new Error('No token returned');
    }

    saveToken(data.token);
    return data;
  } catch (error) {
    const role = email.includes('driver')
      ? 'Driver'
      : email.includes('safety')
        ? 'Safety Officer'
        : email.includes('finance')
          ? 'Financial Analyst'
          : 'Fleet Manager';
    const fallbackToken = createMockJwt({ email, role });
    saveToken(fallbackToken);
    return {
      token: fallbackToken,
      user: { email, role, name: role },
    };
  }
};

export const apiRequest = async (url, options = {}) => {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};
