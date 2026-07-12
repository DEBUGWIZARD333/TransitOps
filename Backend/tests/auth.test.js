const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { signupUser, loginUser, authenticateJWT, authorizeRoles, usersTable } = require('../auth');

const originalSecret = process.env.JWT_SECRET;

function resetUsers() {
  usersTable.length = 0;
}

test.beforeEach(() => {
  resetUsers();
  process.env.JWT_SECRET = 'test-secret';
});

test.after(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

test('signup creates a user with a hashed password', async () => {
  const result = await signupUser({
    name: 'Ava',
    email: 'ava@example.com',
    password: 'Password123!',
    role: 'fleet_manager'
  });

  assert.equal(result.user.email, 'ava@example.com');
  assert.equal(result.user.role, 'fleet_manager');
  assert.equal(usersTable.length, 1);
  assert.notEqual(usersTable[0].password_hash, 'Password123!');
});

test('login returns a JWT for valid credentials and rejects invalid ones', async () => {
  await signupUser({
    name: 'Ben',
    email: 'ben@example.com',
    password: 'Password123!',
    role: 'driver'
  });

  const result = await loginUser({
    email: 'ben@example.com',
    password: 'Password123!'
  });

  assert.ok(result.token);
  assert.equal(result.user.email, 'ben@example.com');

  await assert.rejects(
    () => loginUser({ email: 'ben@example.com', password: 'wrong-password' }),
    /Invalid credentials/
  );
});

test('signup and login support the financial analyst role', async () => {
  const signupResult = await signupUser({
    name: 'Dana',
    email: 'dana@example.com',
    password: 'Password123!',
    role: 'financial analyst'
  });

  assert.equal(signupResult.user.role, 'financial_analyst');

  const loginResult = await loginUser({
    email: 'dana@example.com',
    password: 'Password123!'
  });

  assert.equal(loginResult.user.role, 'financial_analyst');
  assert.ok(loginResult.token);
});

test('authenticateJWT attaches the user role and authorizeRoles blocks unauthorized access', () => {
  const user = {
    id: 'u-1',
    name: 'Casey',
    email: 'casey@example.com',
    role: 'safety_officer'
  };

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, 'test-secret');

  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  authenticateJWT(req, res, next);
  assert.equal(req.user.role, 'safety_officer');
  assert.equal(nextCalled, true);

  const restricted = authorizeRoles('fleet_manager');
  const forbiddenRes = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  restricted(req, forbiddenRes, () => {});
  assert.equal(forbiddenRes.statusCode, 403);
});
