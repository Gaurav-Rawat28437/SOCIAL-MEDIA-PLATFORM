const mongoose=require("mongoose")

const verifiedSchema=new mongoose.Schema({
    email:{
        required:true,
        unique:true,
        type:String,
        trim:true
    },
    expireAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  }
},{
    timestamps:true
})

const verifiedMailModel=mongoose.model("verify-mail",verifiedSchema)

module.exports={
    verifiedMailModel
}