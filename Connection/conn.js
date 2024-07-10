const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://farmer:management@project1.mchokat.mongodb.net/").then(()=>{
    console.log("Connected to MongoDB")
}).catch((error)=>{
    console.log("Error while connecting to MongoDB",error)
})
