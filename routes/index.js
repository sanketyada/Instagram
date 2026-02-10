var express = require("express");
var router = express.Router();
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const upload = require("../config/multer");
const LocalStratagy = require("passport-local");
const passport = require("passport");
passport.use(new LocalStratagy(userModel.authenticate()));

//render ragister form page
router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

//took request comming from index page
router.post("/register", async (req, res) => {
  console.log(req.body);
  const newUser = await userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
  });

  await userModel.register(newUser, req.body.password).then(() => {
    //this logic do login by data that just you created above
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

//render login form page
router.get("/login", function (req, res) {
  res.render("login", { footer: false, error: req.flash("error") });
});
//took request comming from login page
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {},
);

//logout people
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(401).send("Unable To Logout");
    }
    res.redirect("/profile");
  });
});

//Check is user is session or Not
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    {
      return next();
    }
  }
  res.redirect("/login");
}

//render Edit page
router.get("/edit", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });

  res.render("edit", { footer: true, user });
});

//took request from edit page
router.post("/update", isLoggedIn, upload.single("dp"), async (req, res) => {
  // console.log(req.file)
  // console.log(req.session.passport.user)

  const user = await userModel.findOne({ username: req.session.passport.user });
  const userUpdate = await userModel.findOneAndUpdate(
    { username: req.session.passport.user },
    {
      username: req.body.username,
      name: req.body.name,
      bio: req.body.bio,
    },
    { new: true },
  );
  if (req.file) {
    user.profileImg = req.file.path;
    user.save();
  }

  res.redirect("/profile");
});

//took request from upload page
router.post("/upload", upload.single("image"), async (req, res) => {
  // console.log(req.file.filename)
  // console.log(req.body.caption)
  const user = await userModel.findOne({ username: req.session.passport.user });

  const newPost = await postModel.create({
    postCaption: req.body.caption,
    postimage: req.file.path,
    user: user._id,
  });
  user.posts.push(newPost._id);
  user.save();
  res.redirect("/profile");
});

//profile of people
router.get("/profile", isLoggedIn, async function (req, res) {
  // console.log(req.session)
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  // const post = await postModel.find()
  console.log(user)
  res.render("profile", { footer: true, user });
});

//feed of people
router.get("/feed", isLoggedIn, async function (req, res) {
  const posts = await postModel.find().populate("user");
  // console.log(posts)
  const user = await userModel.findOne({ username: req.session.passport.user });
  const alluser = await userModel.find();
  res.render("feed", { footer: true, posts, user, alluser });
});

//like
router.get("/like/:id", isLoggedIn, async (req, res) => {
  // console.log(req.params.id);

  const post = await postModel.findOne({ _id: req.params.id });
  const user = await userModel.findOne({ username: req.session.passport.user });

  if (post.likes.indexOf(user._id) === -1) {
    post.likes.push(user._id);
  } else {
    post.likes.splice(post.likes.indexOf(user._id), 1);
  }

  await post.save();
  res.redirect("/feed");
});

//Open Search Page
router.get("/search", isLoggedIn, function (req, res) {
  res.render("search", { footer: true });
});

router.get("/username/:username", async (req, res) => {
  const regex = new RegExp(`^${req.params.username}`, `i`);

  const userfind = await userModel.find({ username: regex });
  res.json(userfind);
});

router.get("/upload", isLoggedIn, function (req, res) {
  res.render("upload", { footer: true });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  console.log(user);

  const postId = req.params.id;
  // console.log(postId);

  if (user.posts.includes(postId)) {
    // remove from user's posts
    user.posts.pull(postId);
    await user.save();

    // delete the actual post
    await postModel.findByIdAndDelete(postId);
  }

  res.redirect("/feed");
});

module.exports = router;
