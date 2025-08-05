import { NextFunction, Request, Response } from "express";
import { getProductModel } from "../models/product";

export class productService {

    public getProducts = async (req: Request, res: Response, next: NextFunction) => {
        try{
            
            const ProductModel = getProductModel();
            const products = await ProductModel.find({});

            
            if (products.length === 0) {
                return { status: false, message: "No products found" };
            }

            return { status: true, data: products };

        
        }catch(error){
            console.error("Error fetching products:", error);
            throw (error)
        }
    };

    public getProduct = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const ProductModel = getProductModel();
            const productId = req.params.id;
            const product = await ProductModel.findById(productId);

            if (!product) {
                return { status: false, message: "Product not found" };
            }

            return { status: true, data: product };

        }catch(error){
            console.error("Error fetching product:", error);
            throw (error)
        }
    };
    

    //get tags Stories
    public createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const ProductModel = getProductModel();
            const newProduct = new ProductModel(req.body);
            const savedProduct = await newProduct.save();

            if (!savedProduct) {
                return { status: false, message: "Failed to create product" };
            }

            return { status: true, data: savedProduct };

        }catch(error){
            console.error("Error creating product:", error);
            throw (error)
        }
    };
    
    //update product
    public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const ProductModel = getProductModel();
            const productId = req.params.id;
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true });
            if (!updatedProduct) {
                return { status: false, message: "Failed to update product" };
            }
            return { status: true, data: updatedProduct };



        }catch(error){
            console.error("Error updating product:", error);
            throw (error)
        }
    };


    public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const ProductModel = getProductModel();
            const productId = req.params.id;
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);

            if (!deletedProduct) {
                return { status: false, message: "Failed to delete product" };
            }

            return { status: true, data: deletedProduct };

        }catch(error){
            console.error("Error deleting product:", error);
            throw (error)
        }
    };
    




}

