jest.mock('../src/queues/emailQueue', () => ({
    add: jest.fn().mockResolvedValue(true),
  }));
  
  jest.mock('../src/services/authService');
  
  const request = require('supertest');
  const app = require('../src/app');
  const authService = require('../src/services/authService');
  
  describe('Auth API', () => {
    it('POST /api/auth/register should create a user', async () => {
      authService.register.mockResolvedValue({ id: 1, username: 'test' });
  
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'test', password: '123456', email: 'test@mail.com' });
  
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User created');
    });
  
    it('POST /api/auth/login should return token', async () => {
      authService.login.mockResolvedValue('mocked-jwt');
  
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'test', password: '123456' });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe('mocked-jwt');
    });
  
    afterAll(() => {
      jest.clearAllMocks();
    });
  });
  