const User = require("../models/user")

module.exports.signUp = async (req , res) =>{

    try{
        let{ username, email , password} = req.body;
    const newuser  = new User({email , username})
    const registeredUser = await User.register(newuser , password)
    console.log(registeredUser)
    req.login(registeredUser , (err) =>{
        if(err){
            return next(err)
        }
        req.flash("success" , "Welcome to Wanderlust!")
        res.redirect("/listings")
    })
  
    }catch(e){
        req.flash("error" , e.message)
        res.redirect("/signup")
    }
    
}

module.exports.login = async (req , res) => {
    let {username , password} = req.body
    console.log(username)
    // res.send("you are loged in")
    req.flash("success" , "Welcome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}
