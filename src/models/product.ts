
import mongoose, { model, Schema, Types } from "mongoose";


const modelName = "products";


interface IProductModel extends Document {
  name: string,
  description: string,
  price: number,
  categoryId: Types.ObjectId
}

let productSchema: Schema = new Schema<IProductModel>({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
},{
    timestamps : true
}) 


function getProductModel(){
    return model<IProductModel>(modelName,productSchema)
}

export { getProductModel,IProductModel }
