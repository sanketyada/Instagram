const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    postCaption:String,
    postimage:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ,
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    date:{
        type:Date,
        default:Date.now,
    }
})

const Post = mongoose.model("Post",postSchema)
module.exports = Post;