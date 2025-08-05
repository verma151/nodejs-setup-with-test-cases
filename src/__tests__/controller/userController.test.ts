import { userController } from '../../controller/users';
import { userService } from '../../service/users';

jest.mock('../../service/users');

describe('User Controller', () => {
  const controller = new userController();

  const mockReq = {
    body: {
      email: 'test@example.com',
      password: 'Test123',
    },
  } as any;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  const mockNext = jest.fn();

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });




  describe('login', () => {
    it('should return 200 for valid login', async () => {
      (userService as jest.Mock).mockImplementation(() => ({
        login: jest.fn().mockResolvedValue({
          status: true,
          data: { token: 'fake', user: {} },
        }),
      }));

      await controller.login(mockReq, mockRes, next);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { token: 'fake', user: {} },
        message: 'Login successful',
      });
    });

    it('should return 400 for invalid login', async () => {
      (userService as jest.Mock).mockImplementation(() => ({
        login: jest.fn().mockResolvedValue({
          status: false,
          message: 'Invalid credentials',
        }),
      }));

      await controller.login(mockReq, mockRes, next);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials',
      });
    });


    it('should return 500 on internal server error', async () => {
      (userService as jest.Mock).mockImplementation(() => ({
        login: jest.fn().mockRejectedValue(new Error('Internal server error')),
      }));

      await controller.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });

  });

  describe('signup', () => {
    it('should return 201 on successful signup', async () => {
      (userService as jest.Mock).mockImplementation(() => ({
        signup: jest.fn().mockResolvedValue({
          status: true,
          data: { id: '123', username: 'test', email: 'test@example.com' },
        }),
      }));

      await controller.signup(mockReq, mockRes, next);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { id: '123', username: 'test', email: 'test@example.com' },
        message: 'Signup successful',
      });
    });

    it('should return 400 if signup fails', async () => {
      (userService as jest.Mock).mockImplementation(() => ({
        signup: jest.fn().mockResolvedValue({
          status: false,
          message: 'User exists',
        }),
      }));

      await controller.signup(mockReq, mockRes, next);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User exists',
      });
    });

    it('should return 500 on internal server error', async () => {
      (userService as jest.Mock).mockImplementation(() => ({
        signup: jest.fn().mockRejectedValue(new Error('Internal server error')),
      }));

      await controller.signup(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });




  });
});
