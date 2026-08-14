const mongoose=require("mongoose")


const otpSchema=new mongoose.Schema({

    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    expireAt:{
        type:Date,
        default:Date.now,
        expires:120,

    }
},{
    timestamps:true
})

const otpModel=mongoose.model("OTP",otpSchema)

module.exports={
    otpModel
}