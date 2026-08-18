const app=require("./app")
require("dotenv").config()


const dns = require("dns")

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
])

const mongoose=require("mongoose")

const PORT=process.env.PORT || 8080

mongoose.connect(process.env.MONGO_URL)
    .then(()=>{

        console.log("MONGO DB is connected...")


        app.listen(PORT,()=>{
            console.log(`server is running on port ${PORT}...`)
        })
    })
    .catch((error)=>{
        console.log(error)
    })

