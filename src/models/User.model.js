const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type: String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minLength:2,
        maxLength:12
    },
    firstName:{
        type:String,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    dateOfBirth:{
        type:Date
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    displayPicture:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        maxlength:500,
        default:""
    },
    isCompletedProfile:{
        type:Boolean,
        default:false
    },
    followers : [],
    following : [],
    posts : []
},{
    timestamps:true
})

const userModel=mongoose.model("user",userSchema)

module.exports={
    userModel
}