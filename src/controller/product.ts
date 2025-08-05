import { NextFunction, Request, Response } from 'express'
import { productService } from '../service/product';


export class productController {

  // get products  
  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let productManager = new productService()
      let result: any = await productManager.getProducts(req, res, next)
      if (!result.status) {
        return res.status(400).json({ success: false, message: result.message || 'Something went wrong' });
      }
      return res.status(200).json({ success: true, data: result.data, message: 'Fetched products successfully' });

    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  }

  //get a product
  public getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let productManager = new productService()
      let result: any = await productManager.getProduct(req, res, next)
      if (!result.status) {
        return res.status(400).json({ success: false, message: result.message || 'Something went wrong' });
      }
      return res.status(200).json({ success: true, data: result.data, message: 'Data Fetched Successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  }

  //craete a product
  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let productManager = new productService()
      let result: any = await productManager.createProduct(req, res, next)
      if (!result.status) {
        return res.status(400).json({ success: false, message: result.message || 'Something went wrong' });
      }
      return res.status(200).json({ success: true, data: result.data, message: 'Product created successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  }

  //update product
  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let productManager = new productService()
      let result: any = await productManager.updateProduct(req, res, next)
      if (!result.status) {
        return res.status(400).json({ success: false, message: result.message || 'Something went wrong' });
      }
      return res.status(200).json({ success: true, data: result.data, message: 'Product updated successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  }

  //delete product
  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let productManager = new productService()
      let result: any = await productManager.deleteProduct(req, res, next)
      if (!result.status) {
        return res.status(400).json({ success: false, message: result.message || 'Something went wrong' });
      }
      return res.status(200).json({ success: true, data: result.data, message: 'Deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  }

}