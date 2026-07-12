const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersTable = [];

const VALID_ROLES = ['fleet_manager', 'driver', 'safety_officer', 'financial_analyst'];

function normalizeRole(role) {
  const normalizedRole = role === 'financial analyst' ? 'financial_analyst' : role;

  if (!VALID_ROLES.includes(normalizedRole)) {
    throw new Error('Invalid role');
  }

  return normalizedRole;
}

async function signupUser({ name, email, password, role }) {
  const normalizedRole = normalizeRole(role);
  const existingUser = usersTable.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = {
    id: `user_${usersTable.length + 1}`,
    name,
    email,
    password_hash,
    role: normalizedRole
  };

  usersTable.push(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

async function loginUser({ email, password }) {
  const user = usersTable.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

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

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '1h'
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
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

module.exports = {
  signupUser,
  loginUser,
  authenticateJWT,
  authorizeRoles,
  usersTable,
  VALID_ROLES
};
