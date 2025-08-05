import { productController } from '../../controller/product';
import { productService } from '../../service/product';

jest.mock('../../service/product');

describe('Product Controller', () => {
  const controller = new productController();

  const mockReq = {
    body: {
      name: 'Test Product',
      price: 99,
    },
    params: {
      id: 'productId123',
    },
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
    it('should return 200 with product list', async () => {
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

    it('should return 400 with product list when list is empty', async () => {
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

    it('should return 400 on failure', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProducts: jest.fn().mockResolvedValue({
          status: false,
          message: 'Error fetching products',
        }),
      }));

      await controller.getProducts(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error fetching products',
      });
    });

    it('should return 500 on internal server error', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProducts: jest.fn().mockRejectedValue(new Error('Internal server error')),
      }));

      await controller.getProducts(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });


    it('should throw error in getProducts', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProducts: jest.fn().mockRejectedValue(
         new Error('DB failure')
        ),
      }));

      await controller.getProducts(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB failure'
      });
    });


  });
  describe('getProduct', () => {
    it('should return 200 with product data', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProduct: jest.fn().mockResolvedValue({
          status: true,
          data: { name: 'Product 1' },
        }),
      }));

      await controller.getProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { name: 'Product 1' },
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

    it('should return 500 on internal server error', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProduct: jest.fn().mockRejectedValue(new Error('Internal server error')),
      }));

      await controller.getProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });


      it('should throw error in getProduct', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        getProduct: jest.fn().mockRejectedValue(
         new Error('DB failure')
        ),
      }));

      await controller.getProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB failure'
      });
    });

  });

  describe('createProduct', () => {
    it('should return 200 on successful creation', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        createProduct: jest.fn().mockResolvedValue({
          status: true,
          data: { name: 'Test Product' },
        }),
      }));

      await controller.createProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { name: 'Test Product' },
        message: 'Product created successfully',
      });
    });

    it('should return 400 if creation fails', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        createProduct: jest.fn().mockResolvedValue({
          status: false,
          message: 'Creation failed',
        }),
      }));

      await controller.createProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Creation failed',
      });
    });

    it('should return 500 on internal server error', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        createProduct: jest.fn().mockRejectedValue(new Error('Internal server error')),
      }));

      await controller.createProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });

    it('should throw error in createProduct', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        createProduct: jest.fn().mockRejectedValue(
         new Error('DB failure')
        ),
      }));

      await controller.createProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB failure'
      });
    });

  });

  describe('updateProduct', () => {
    it('should return 200 on successful update', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        updateProduct: jest.fn().mockResolvedValue({
          status: true,
          data: { name: 'Updated Product' },
        }),
      }));

      await controller.updateProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { name: 'Updated Product' },
        message: 'Product updated successfully',
      });
    });

    it('should return 400 on failed update', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        updateProduct: jest.fn().mockResolvedValue({
          status: false,
          message: 'Update failed',
        }),
      }));

      await controller.updateProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Update failed',
      });
    });

    it('should return 500 on internal server error', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        updateProduct: jest.fn().mockRejectedValue(new Error('Internal server error')),
      }));

      await controller.updateProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });

    it('should throw error in updateProduct', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        updateProduct: jest.fn().mockRejectedValue(
         new Error('DB failure')
        ),
      }));

      await controller.updateProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB failure'
      });
    });



  });

  describe('deleteProduct', () => {
    it('should return 200 on successful delete', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        deleteProduct: jest.fn().mockResolvedValue({
          status: true,
          message: 'Deleted successfully',
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
          message: 'Delete failed',
        }),
      }));

      await controller.deleteProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Delete failed',
      });
    });

    it('should return 500 on internal server error', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        deleteProduct: jest.fn().mockRejectedValue(new Error('Internal server error')),
      }));

      await controller.deleteProduct(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });

      it('should throw error in deleteProduct', async () => {
      (productService as jest.Mock).mockImplementation(() => ({
        deleteProduct: jest.fn().mockRejectedValue(
         new Error('DB failure')
        ),
      }));

      await controller.deleteProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB failure'
      });
    });


  });
});
