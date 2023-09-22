const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const Session = require("../models/session");

async function registerTestUser() {
  const response = await request(app)
    .post('/auth/register')
    .send({ email: 'test@example.com', password: 'password123', name: 'Test User' });
  return response.body;
}

async function loginTestUser() {
  const response = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });
  return response.body;
}

describe('Authentication API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Session.deleteMany({});
  });

  describe('User Registration', () => {
    it('should register a new user', async () => {
      const response = await registerTestUser();

      expect(response).toHaveProperty('token');
      expect(response.message).toBe('Registered Successfully');
    });

    it('should handle registration with an existing email', async () => {
      await registerTestUser();

      const response = await registerTestUser(); 

      expect(response.status).toBe(409);
      expect(response.error).toBe('Email already in use');
    });
  });

  describe('User Login', () => {
    it('should log in an existing user', async () => {
      // Register and then login a user
      await registerTestUser();
      const response = await loginTestUser();

      expect(response).toHaveProperty('token');
      expect(response.message).toBe('Logged In Successfully');
    });

    it('should handle login with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

});