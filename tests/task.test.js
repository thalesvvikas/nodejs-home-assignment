const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const { Task, User } = require('../src/models');

jest.mock('../src/models');
jest.mock('../src/queues/emailQueue', () => ({ 
  add: jest.fn().mockResolvedValue(true),
}));

describe('Task API', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ id: 1, role: 'user' }, process.env.JWT_SECRET || 'testsecret');
  });

  it('GET /api/tasks should return 401 if no token provided', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/tasks should return tasks for authenticated user', async () => {
    Task.findAndCountAll = jest.fn().mockResolvedValue({
      rows: [{ id: 1, title: 'Test Task' }],
      count: 1,
    });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.length).toBe(1);
  });

  it('POST /api/tasks should create a task', async () => {
    Task.create = jest.fn().mockResolvedValue({
      id: 1,
      title: 'New Task',
      userId: 1,
    });

    User.findByPk = jest.fn().mockResolvedValue({ email: 'test@example.com' });

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Task', description: 'Test' });

    expect(res.statusCode).toBe(201);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
