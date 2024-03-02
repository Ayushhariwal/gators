const express = require("express");
const router = express.Router()
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControler = require("../controler/users.js")

router.get("/signup" , (req , res) => {
    res.render("user/signup.ejs")
})

router.post("/signup" , wrapAsync(userControler.signUp))


router.get("/login" , (req , res) => {
    res.render("user/login.ejs")
})


router.post("/login"  ,saveRedirectUrl, passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), userControler.login)


router.get("/logout" , (req  ,res) =>{
    req.logOut((err) =>{
        if(err){
            return next(err)
        }

        req.flash("success" , "You are logged out!")
        res.redirect("/listings")
    })
})

module.exports = router;