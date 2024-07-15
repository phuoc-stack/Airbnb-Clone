const mongoose=require("mongoose") //to interact with MongoDB from Node.js
const {Schema}=mongoose //destructure the Schema class from the mongoose object
//define the schema 
const UserSchema = new Schema({ //create a new mongoose schema called UserSchema
    name:String, 
    email:{type:String, unique:true},
    password:String,
})

//create a model based on the schema
const UserModel=mongoose.model('User',UserSchema); //create a mongoose model based on UserSchema; a complied version of schema that interacts with the users MongoDB collection

module.exports=UserModel