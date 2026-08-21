const express=require("express")
const cors=require("cors")
require("dotenv").config()
const app=express()
const cookieParser=require("cookie-parser")

const {authRouter}=require("./routes/auth.routes")
const {profileRouter}=require("./routes/profile.routes")



app.use(cors({
    origin:[process.env.FE_URL,"http://localhost:5173"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/profile",profileRouter)

app.use((req,res)=>{
    res.status(400).json({
        error:"api not found,this api is not a part of server"
    })
})

app.get("/",(req,res)=>{
    try{
        res.json({
            msg:"all good"
        })
    }
    catch(error){
        console.log(error)
        res.json({
            msg:error.message,
            error:error
        })
    }
})

module.exports=app