const mongoose = require("mongoose")

function connectDB (){
    mongoose.connect(`${process.env.MONGODB_URI}/Instagram`).then(()=>{
        console.log("Database Connected")
    })
}
module.exports = connectDB