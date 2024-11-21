const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://komalguptagupta234:komalkajal@cluster0.dl2b6.mongodb.net").then(()=>{
    console.log("Connected to MongoDB")
}).catch((error)=>{
    console.log("Error while connecting to MongoDB",error)
})
