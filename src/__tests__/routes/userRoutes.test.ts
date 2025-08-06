import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/users';

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

// Mock userController methods
jest.mock('../../controller/users', () => {
  return {
    userController: jest.fn().mockImplementation(() => ({
      login: (req: any, res: any) => {
        const { email, password, triggerError } = req.body;
        if (triggerError) {
          throw new Error('Internal server error in login');
        }
        if (!email || !password) {
          return res.status(400).json({ route: 'login', success: false, message: 'Missing fields' });
        }
        return res.status(200).json({ route: 'login', success: true });
      },
      signup: (req: any, res: any) => {
        const { username, email, password, triggerError } = req.body;
        if (triggerError) {
          throw new Error('Internal server error in signup');
        }
        if (!username || !email || !password) {
          return res.status(400).json({ route: 'signup', success: false, message: 'Missing fields' });
        }
        return res.status(200).json({ route: 'signup', success: true });
      },
    })),
  };
});

// Global error handler middleware to catch uncaught errors
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

describe('User Routes', () => {
  // ✅ Positive signup
  it('POST /users/signup - success', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({ username: 'test', email: 'test@example.com', password: 'Test123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.route).toBe('signup');
    expect(res.body.success).toBe(true);
  });

  // ❌ Negative signup (missing fields)
  it('POST /users/signup - 400 for missing fields', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({ email: 'test@example.com' }); // missing username and password

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Missing fields');
  });

  // ❌ 500 Internal Server Error for signup
  it('POST /users/signup - 500 internal server error', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({ triggerError: true, username: 'test', email: 'test@example.com', password: 'Test123' });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Internal Server Error');
  });

  // ❌ Invalid method for signup
  it('GET /users/signup - 404 for invalid method', async () => {
    const res = await request(app).get('/users/signup');
    expect(res.statusCode).toBe(404);
  });

  // ✅ Positive login
  it('POST /users/login - success', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'Test123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.route).toBe('login');
    expect(res.body.success).toBe(true);
  });

  // ❌ Negative login (missing fields)
  it('POST /users/login - 400 for missing fields', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com' }); // missing password

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Missing fields');
  });

  // ❌ 500 Internal Server Error for login
  it('POST /users/login - 500 internal server error', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ triggerError: true, email: 'test@example.com', password: 'Test123' });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Internal Server Error');
  });

  // ❌ Invalid method for login
  it('GET /users/login - 404 for invalid method', async () => {
    const res = await request(app).get('/users/login');
    expect(res.statusCode).toBe(404);
  });
});
