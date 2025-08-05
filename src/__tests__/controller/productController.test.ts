import { productController } from '../../controller/product';
import { productService } from '../../service/product';

jest.mock('../../service/product');

describe('Product Controller with JWT Auth', () => {
  const controller = new productController();

  const mockReq = {
    body: {
      name: 'Test Product',
      price: 99,
    },
    params: {
      id: 'productId123',
    },
    user: { // JWT decoded user info
      id: 'userId123',
      email: 'test@example.com',
    },
    headers: {
      authorization: 'Bearer valid-jwt-token'
    }
  } as any;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return 200 with product list for authenticated user', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProducts: jest.fn().mockResolvedValue({
          status: true,
          data: [{ name: 'Product 1' }],
        }),
      }));

      await controller.getProducts(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: [{ name: 'Product 1' }],
        message: 'Fetched products successfully',
      });
    });

    it('should return 400 when no products found', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProducts: jest.fn().mockResolvedValue({
          status: false,
          message: 'No products found'
        }),
      }));

      await controller.getProducts(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'No products found'
      });
    });

    it('should return 500 on internal server error', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProducts: jest.fn().mockRejectedValue(new Error('Database connection failed')),
      }));

      await controller.getProducts(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database connection failed',
      });
    });
  });

  describe('getProduct', () => {
    it('should return 200 with product data for authenticated user', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProduct: jest.fn().mockResolvedValue({
          status: true,
          data: { name: 'Product 1', price: 99 },
        }),
      }));

      await controller.getProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { name: 'Product 1', price: 99 },
        message: 'Data Fetched Successfully',
      });
    });

    it('should return 400 if product not found', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProduct: jest.fn().mockResolvedValue({
          status: false,
          message: 'Product not found',
        }),
      }));

      await controller.getProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found',
      });
    });
  });

  describe('createProduct', () => {
    it('should return 200 on successful creation with valid JWT', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        createProduct: jest.fn().mockResolvedValue({
          status: true,
          data: { name: 'Test Product', createdBy: 'userId123' },
        }),
      }));

      await controller.createProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { name: 'Test Product', createdBy: 'userId123' },
        message: 'Product created successfully',
      });
    });

    it('should return 400 if creation fails', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        createProduct: jest.fn().mockResolvedValue({
          status: false,
          message: 'Validation failed',
        }),
      }));

      await controller.createProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
      });
    });
  });

  describe('updateProduct', () => {
    it('should return 200 on successful update with valid JWT', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        updateProduct: jest.fn().mockResolvedValue({
          status: true,
          data: { name: 'Updated Product', updatedBy: 'userId123' },
        }),
      }));

      await controller.updateProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { name: 'Updated Product', updatedBy: 'userId123' },
        message: 'Product updated successfully',
      });
    });

    it('should return 400 on failed update', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        updateProduct: jest.fn().mockResolvedValue({
          status: false,
          message: 'Product not found',
        }),
      }));

      await controller.updateProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should return 200 on successful delete with valid JWT', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        deleteProduct: jest.fn().mockResolvedValue({
          status: true,
          message: 'Product deleted successfully',
        }),
      }));

      await controller.deleteProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Deleted successfully',
      });
    });

    it('should return 400 on failed delete', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        deleteProduct: jest.fn().mockResolvedValue({
          status: false,
          message: 'Product not found',
        }),
      }));

      await controller.deleteProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found',
      });
    });
  });
});
