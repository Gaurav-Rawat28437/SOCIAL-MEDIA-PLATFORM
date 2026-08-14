const express=require("express")

const app=express()
const {authRouter}=require("./routes/auth.routes")

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