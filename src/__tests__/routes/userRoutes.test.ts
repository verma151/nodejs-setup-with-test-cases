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
      login: (req: any, res: any) => res.status(200).json({ route: 'login', success: true }),
      signup: (req: any, res: any) => res.status(201).json({ route: 'signup', success: true }),
    })),
  };
});

describe('User Routes', () => {
  it('POST /users/signup - should route to signup controller', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({ username: 'test', email: 'test@example.com', password: 'Test123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.route).toBe('signup');
  });

  it('POST /users/login - should route to login controller', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'Test123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.route).toBe('login');
  });
});
