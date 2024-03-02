if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
// console.log(process.env.CLOUD_NAME)

const express = require("express");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const mongoose = require('mongoose');
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")


const app = express();

const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname , "/public")))
app.engine("ejs" , ejsMate);


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUnintialized : true,
    Cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(session(sessionOptions))


app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/" , (req , res) =>{
    res.send("Hi I am root")
})

main().then(() =>{
    console.log("connected to db");
}).catch((err) =>{
    console.log(err); 
})

app.use((req , res , next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})


// app.get("/demouser" , async (req , res) => {
//     const faskeUser = new User({
//         email : "ay@gmail.com",
//         username : "student"
//     })
//     let registeredUser = await User.register(faskeUser , "hello");
//     res.send(registeredUser)
// })


app.use("/listings" , listingsRouter)
app.use("/listings/:id/reviews" , reviewsRouter)
app.use("/" , userRouter)


app.use((err , req , res , next) =>{
   let{statusCode = 500 , message = "something went wrong"} = err;
   res.status(statusCode).send(message)
   res.render("error.ejs" , (message))
})


app.all("*" , (req, res , next) =>{
    next(new ExpressError(404 , "Page Not Found!"))
})

app.listen(8080 , () =>{
    console.log("port is litsening to 8080")
})


