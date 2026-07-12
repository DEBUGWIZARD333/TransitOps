const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersTable = [];

const VALID_ROLES = ['fleet_manager', 'dispatcher', 'driver', 'safety_officer', 'financial_analyst'];

const ROLE_ALIASES = {
  admin: 'fleet_manager',
  fleet_manager: 'fleet_manager',
  fleet: 'fleet_manager',
  dispatcher: 'dispatcher',
  driver: 'driver',
  safety_officer: 'safety_officer',
  safety: 'safety_officer',
  financial_analyst: 'financial_analyst',
  finance: 'financial_analyst',
};

const ROLE_LABELS = {
  fleet_manager: 'Fleet Manager',
  dispatcher: 'Dispatcher',
  driver: 'Driver',
  safety_officer: 'Safety Officer',
  financial_analyst: 'Financial Analyst',
};

function normalizeRole(role) {
  const normalizedRole = String(role || '').trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
  const mappedRole = ROLE_ALIASES[normalizedRole] || normalizedRole;
  if (!VALID_ROLES.includes(mappedRole)) {
    throw new Error('Invalid role');
  }
  return mappedRole;
}

function formatRole(role) {
  return ROLE_LABELS[role] || role;
}

function getUsernameFromInput(name, username, email) {
  return String(username || name || email || '').trim();
}

function getEmailFromInput(username, email) {
  const seed = String(username || email || 'user').trim().toLowerCase().replace(/[^a-z0-9]+/g, '.');
  return String(email || `${seed || 'user'}@transitops.local`).trim();
}

async function seedDefaultAdmin() {
  if (usersTable.some((entry) => entry.email === 'admin@transitops.com')) {
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@1234', 10);
  usersTable.push({
    id: 'admin_1',
    name: 'Admin',
    username: 'admin',
    email: 'admin@transitops.com',
    password_hash: passwordHash,
    role: 'fleet_manager',
    status: 'Active',
    loginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
  });
}

async function signupUser({ name, email, username, password, role }) {
  const normalizedRole = normalizeRole(role);
  const normalizedUsername = getUsernameFromInput(name, username, email);
  const normalizedEmail = getEmailFromInput(normalizedUsername, email);

  if (!normalizedUsername || !password || !normalizedEmail) {
    const error = new Error('Username, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = usersTable.find((user) => {
    const sameEmail = user.email.toLowerCase() === normalizedEmail.toLowerCase();
    const sameUsername = user.username?.toLowerCase() === normalizedUsername.toLowerCase();
    return sameEmail || sameUsername;
  });

  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: `user_${usersTable.length + 1}`,
    name: normalizedUsername,
    username: normalizedUsername,
    email: normalizedEmail,
    password_hash: passwordHash,
    role: normalizedRole,
    status: 'Active',
    loginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
  };

  usersTable.push(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
}

async function loginUser({ email, username, password }) {
  const credential = String(username || email || '').trim().toLowerCase();
  const user = usersTable.find((entry) => {
    const matchesEmail = entry.email.toLowerCase() === credential;
    const matchesUsername = entry.username?.toLowerCase() === credential;
    return matchesEmail || matchesUsername;
  });

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    const error = new Error('Account locked after 5 failed login attempts.');
    error.statusCode = 423;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      user.status = 'Locked';
    }
    const error = new Error(user.loginAttempts >= 5 ? 'Account locked after 5 failed login attempts.' : 'Invalid email or password.');
    error.statusCode = user.loginAttempts >= 5 ? 423 : 401;
    throw error;
  }

  user.loginAttempts = 0;
  user.lockedUntil = null;
  user.status = 'Active';

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = usersTable.find((entry) => entry.id === decoded.sub);

    if (!user) {
      req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
      return next();
    }

    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}

function listUsers() {
  return usersTable.map((entry) => ({
    id: entry.id,
    name: entry.name,
    username: entry.username,
    email: entry.email,
    role: formatRole(entry.role),
    status: entry.status || 'Active',
    createdAt: entry.createdAt,
  }));
}

seedDefaultAdmin();

module.exports = {
  usersTable,
  signupUser,
  loginUser,
  authenticateJWT,
  authorizeRoles,
  listUsers,
  normalizeRole,
  formatRole,
};
