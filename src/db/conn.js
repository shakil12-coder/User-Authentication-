const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/registratinsForm" )
.then(()=>{
    console.log("connections successfull")
}).catch(()=>{
    console.log(`failure in database creation`)
})