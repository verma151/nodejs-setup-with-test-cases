import { userService } from '../../service/users';
import { getUserModel } from '../../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../models/users');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Service', () => {
    const service = new userService();

    describe('login', () => {
        it('should return success with valid credentials', async () => {
            const req: any = { body: { email: 'test@example.com', password: 'Test123' } };
            const res: any = {};
            const next: any = () => { };

            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedPassword',
            };

            (getUserModel as jest.Mock).mockReturnValue({
                findOne: jest.fn().mockResolvedValue(mockUser),
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

            const result: any = await service.login(req, res, next);

            expect(result.status).toBe(true);
            expect(result.data.token).toBe('fake-jwt-token');
        });

        it('should return failure if user not found', async () => {
            const req: any = { body: { email: 'test@example.com', password: 'Test123' } };
            (getUserModel as jest.Mock).mockReturnValue({
                findOne: jest.fn().mockResolvedValue(null),
            });

            const result = await service.login(req, {} as any, {} as any);
            expect(result.status).toBe(false);
            expect(result.message).toBe('User not found');
        });

        it('should return failure if password is incorrect', async () => {
            const mockUser = { email: 'test@example.com', password: 'hashed' };
            (getUserModel as jest.Mock).mockReturnValue({
                findOne: jest.fn().mockResolvedValue(mockUser),
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await service.login({ body: { email: 'test@example.com', password: 'wrong' } } as any, {} as any, {} as any);
            expect(result.status).toBe(false);
            expect(result.message).toBe('Invalid credentials');
        });

        it('should fail if email or password is missing', async () => {
            const result1 = await service.login({
                body: { email: '', password: 'Test123' },
            } as any, {} as any, {} as any);

            expect(result1.status).toBe(false);
            expect(result1.message).toBe('Email and password are required');

            const result2 = await service.login({
                body: { email: 'test@example.com', password: '' },
            } as any, {} as any, {} as any);

            expect(result2.status).toBe(false);
            expect(result2.message).toBe('Email and password are required');
        });

        it('should handle internal error during login (catch block)', async () => {
            (getUserModel as jest.Mock).mockReturnValue({
                findOne: jest.fn().mockRejectedValue(new Error('DB failure')),
            });

            const resultPromise = service.login({
                body: { email: 'test@example.com', password: 'Test123' },
            } as any, {} as any, {} as any);

            await expect(resultPromise).rejects.toThrow('DB failure');
        });


    });

    describe('signup', () => {
        it('should return success on valid data', async () => {
            // ✅ 1. Create a mocked User "class" with constructor and save method
            class MockUser {
                _id = 'new123';
                username: string;
                email: string;
                password: string;
                save = jest.fn().mockResolvedValue(true);
                static findOne: jest.Mock<any, any, any>;

                constructor(data: any) {
                    this.username = data.username;
                    this.email = data.email;
                    this.password = data.password;
                }
            }

            // ✅ 2. Return the constructor from getUserModel()
            (getUserModel as jest.Mock).mockReturnValue(MockUser);

            // ✅ 3. Mock bcrypt.hash to simulate password hashing
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

            // ✅ 4. Setup findOne to return null (user doesn't exist)
            const mockFindOne = jest.fn().mockResolvedValue(null);
            MockUser.findOne = mockFindOne; // Static method simulation (Mongoose style)

            // ✅ 5. Call signup
            const result: any = await service.signup({
                body: {
                    username: 'test',
                    email: 'test@example.com',
                    password: 'Test123',
                },
            } as any, {} as any, {} as any);

            // ✅ 6. Assert
            expect(result.status).toBe(true);
            expect(result.data.username).toBe('test');
        });


        it('should fail if email already exists', async () => {
            (getUserModel as jest.Mock).mockReturnValue({
                findOne: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
            });

            const result = await service.signup({
                body: {
                    username: 'test',
                    email: 'test@example.com',
                    password: 'Test123',
                },
            } as any, {} as any, {} as any);

            expect(result.status).toBe(false);
            expect(result.message).toBe('User already exists with this email');
        });

        it('should fail if required signup fields are missing', async () => {
            const result = await service.signup({
                body: { username: '', email: '', password: '' },
            } as any, {} as any, {} as any);

            expect(result.status).toBe(false);
            expect(result.message).toBe('Required Fields');
        });

        it('should handle internal error during signup (catch block)', async () => {

            (getUserModel as jest.Mock).mockReturnValue({
                findOne: jest.fn().mockRejectedValue(new Error('DB failure')),
            });

            const resultPromise = service.signup({
                body: { username: 'test', email: 'test@example.com', password: 'Test123' },
            } as any, {} as any, {} as any);

            await expect(resultPromise).rejects.toThrow('DB failure');

        });



    });
});
