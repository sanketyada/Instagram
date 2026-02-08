const mongoose = require("mongoose");
const plm = require("passport-local-mongoose").default;
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  name: String,
  profileImg: String,
  bio:String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});
userSchema.plugin(plm);
const User = mongoose.model("User", userSchema);
module.exports = User;
