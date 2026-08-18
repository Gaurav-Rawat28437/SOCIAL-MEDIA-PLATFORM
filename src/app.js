const express=require("express")
const cors=require("cors")
require("dotenv").config()

const app=express()
const {authRouter}=require("./routes/auth.routes")

app.use(cors({
    origin:[process.env.FE_URL,"http://localhost:5173"]
}))
app.use(express.json())

app.use("/api/auth",authRouter)


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