import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import router from '../../routes/index';
import { getProductModel } from '../../models/product';

// Mock dependencies
jest.mock('../../models/product');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/', router);

// Mock JWT secret for testing
process.env.JWT_SECRET = 'test-secret-key';

const mockProduct = {
  _id: '64f86a3e094f0d00214c4df1',
  name: 'Test Product',
  price: 99,
  description: 'A test product',
};

const mockUser = {
  id: 'userId123',
  email: 'test@example.com',
};

// Valid JWT token for testing
const validToken = 'valid-jwt-token';

describe('Product Routes with JWT Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock JWT verification to return valid user
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);
  });

  describe('Authentication Tests', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const res = await request(app).get('/products');

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Please re-login to use application');
    });

    it('should return 401 when authorization header format is invalid', async () => {
      const res = await request(app)
        .get('/products')
        .set('Authorization', 'InvalidFormat');

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Token missing, please re-login');
    });

    it('should return 401 when token is missing in Bearer format', async () => {
      const res = await request(app)
        .get('/products')
        .set('Authorization', 'Bearer ');

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Token missing, please re-login');
    });

    it('should return 401 when JWT token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer invalid-token`);

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Invalid token, please login again');
    });
  });

  describe('GET /products', () => {
    it('should return all products with valid JWT (200)', async () => {
      (getProductModel as jest.Mock).mockReturnValue({
        find: jest.fn().mockResolvedValue([mockProduct]),
      });

      const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
    });

    it('should return 400 when no products found', async () => {
      (getProductModel as jest.Mock).mockReturnValue({
        find: jest.fn().mockResolvedValue([]),
      });

      const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('No products found');
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product by ID with valid JWT (200)', async () => {
      (getProductModel as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(mockProduct),
      });

      const res = await request(app)
        .get(`/products/${mockProduct._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(mockProduct.name);
      expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
    });

    it('should return 400 for non-existent product with valid JWT', async () => {
      (getProductModel as jest.Mock).mockReturnValue({
        findById: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app)
        .get(`/products/${mockProduct._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Product not found');
    });

    it('should return 401 without valid JWT', async () => {
      const res = await request(app).get(`/products/${mockProduct._id}`);

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
    });
  });

  describe('POST /products', () => {
    it('should create a product with valid JWT (200)', async () => {
      const saveMock = jest.fn().mockResolvedValue(mockProduct);
      (getProductModel as jest.Mock).mockReturnValue(function () {
        return { save: saveMock };
      });

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Test Product', price: 99 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
    });

    it('should return 401 when creating product without JWT', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'Test Product', price: 99 });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Please re-login to use application');
    });

    it('should return 400 when creation fails with valid JWT', async () => {
      const saveMock = jest.fn().mockRejectedValue(new Error('Validation error'));
      (getProductModel as jest.Mock).mockReturnValue(function () {
        return { save: saveMock };
      });

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Test Product', price: 99 });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /products/:id', () => {
    it('should update a product with valid JWT (200)', async () => {
      (getProductModel as jest.Mock).mockReturnValue({
        findByIdAndUpdate: jest.fn().mockResolvedValue(mockProduct),
      });

      const res = await request(app)
        .put(`/products/${mockProduct._id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ price: 120 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
    });

    it('should return 401 when updating without JWT', async () => {
      const res = await request(app)
        .put(`/products/${mockProduct._id}`)
        .send({ price: 120 });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
    });

    it('should return 400 if update fails with valid JWT', async () => {
      (getProductModel as jest.Mock).mockReturnValue({
        findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app)
        .put(`/products/${mockProduct._id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ price: 120 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product with valid JWT (200)', async () => {
      (getProductModel as jest.Mock).mockReturnValue({
        findByIdAndDelete: jest.fn().mockResolvedValue(mockProduct),
      });

      const res = await request(app)
        .delete(`/products/${mockProduct._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
    });

    it('should return 401 when deleting without JWT', async () => {
      const res = await request(app).delete(`/products/${mockProduct._id}`);

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
    });

    it('should return 400 if product not found on delete with valid JWT', async () => {
      (getProductModel as jest.Mock).mockReturnValue({
        findByIdAndDelete: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app)
        .delete(`/products/${mockProduct._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('JWT Token Expiry and Edge Cases', () => {
    it('should handle expired JWT token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer expired-token`);

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Invalid token, please login again');
    });

    it('should handle malformed JWT token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        const error = new Error('jwt malformed');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer malformed-token`);

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Invalid token, please login again');
    });

    it('should handle missing JWT_SECRET environment variable', async () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('secretOrPrivateKey is required');
      });

      const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);

      // Restore the original value
      process.env.JWT_SECRET = originalSecret;
    });
  });
});