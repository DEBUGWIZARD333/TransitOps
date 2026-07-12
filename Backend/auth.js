const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersTable = [];

const VALID_ROLES = ['fleet_manager', 'driver', 'safety_officer', 'financial_analyst'];

function normalizeRole(role) {
  const normalizedRole = String(role || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');

  if (normalizedRole === 'admin') {
    return 'fleet_manager';
  }

  if (!VALID_ROLES.includes(normalizedRole)) {
    throw new Error('Invalid role');
  }

  return normalizedRole;
}

function formatRole(role) {
  const roleMap = {
    fleet_manager: 'Fleet Manager',
    driver: 'Driver',
    safety_officer: 'Safety Officer',
    financial_analyst: 'Financial Analyst'
  };

  return roleMap[role] || role;
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

  const password_hash = await bcrypt.hash('Admin@1234', 10);
  usersTable.push({
    id: 'admin_1',
    name: 'Admin',
    username: 'admin',
    email: 'admin@transitops.com',
    password_hash,
    role: 'fleet_manager',
    status: 'Active',
    createdAt: new Date().toISOString()
  });
}

async function signupUser({ name, email, username, password, role }) {
  const normalizedRole = normalizeRole(role);
  const normalizedUsername = getUsernameFromInput(name, username, email);
  const normalizedEmail = getEmailFromInput(normalizedUsername, email);

  if (!normalizedUsername || !password) {
    const error = new Error('Username and password are required');
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

  const password_hash = await bcrypt.hash(password, 10);
  const user = {
    id: `user_${usersTable.length + 1}`,
    name: normalizedUsername,
    username: normalizedUsername,
    email: normalizedEmail,
    password_hash,
    role: normalizedRole,
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  usersTable.push(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
}

async function createAdminUser(payload) {
  return signupUser(payload);
}

async function loginUser({ email, username, password }) {
  const credential = String(username || email || '').trim().toLowerCase();
  const user = usersTable.find((entry) => {
    const matchesEmail = entry.email.toLowerCase() === credential;
    const matchesUsername = entry.username?.toLowerCase() === credential;
    return matchesEmail || matchesUsername;
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '1h'
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    }
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
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role
      };
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
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

function listUsers(roleFilter = '') {
  return usersTable
    .filter((entry) => !roleFilter || formatRole(entry.role) === roleFilter)
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      username: entry.username,
      email: entry.email,
      role: formatRole(entry.role),
      status: entry.status || 'Active',
      createdAt: entry.createdAt
    }));
}

function disableUser(userId) {
  const user = usersTable.find((entry) => entry.id === userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.status = 'Disabled';
  return user;
}

async function resetUserPassword(userId, temporaryPassword) {
  const user = usersTable.find((entry) => entry.id === userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.password_hash = await bcrypt.hash(temporaryPassword, 10);
  return user;
}

seedDefaultAdmin();

module.exports = {
  signupUser,
  createAdminUser,
  loginUser,
  authenticateJWT,
  authorizeRoles,
  listUsers,
  disableUser,
  resetUserPassword,
  usersTable,
  VALID_ROLES,
  formatRole,
  normalizeRole
};
