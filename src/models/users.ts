
import  { model, Schema } from "mongoose";


const modelName = "users";


interface IUserModel extends Document {
  username: string,
  email: string,
  password : string
}

let userSchema: Schema = new Schema<IUserModel>({
  username: { type: String, required: true},
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
},{
    timestamps : true
}) 


function getUserModel(){
    return model<IUserModel>(modelName,userSchema)
}


export { getUserModel,userSchema }
