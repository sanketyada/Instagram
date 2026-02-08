const mongoose = require("mongoose")

function connectDB (){
    mongoose.connect("mongodb://localhost:27017/instainsta").then(()=>{
        console.log("Database Connected")
    })
}
module.exports = connectDB