const mongoose=require("mongoose")

const verifiedSchema=new mongoose.Schema({
    email:{
        required:true,
        unique:true,
        type:String,
        trim:true
    }
},{
    timestamps:true
})

const verifiedMailModel=mongoose.model("verify-mail",verifiedSchema)

module.exports={
    verifiedMailModel
}