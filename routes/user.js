const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signUp } = require("../Controllers/users.js");

const userController = require("../Controllers/users.js");
 
// for sign up
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));

//for login
router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash:true,
    }),
    userController.login);

//for log out
router.get("/logout",
    userController.logout);


module.exports = router;