const express = require("express");
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
var  Listing = require("../models/listing.js")
const {isLoggedin, isOwner , validatelisting} = require("../middleware.js")
const listingControler = require("../controler/listings.js")

const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })



//Index route
router.get("/" , wrapAsync(listingControler.index))

//Create route  ,validatelisting 
router.post("/"  ,isLoggedin, wrapAsync( listingControler.createListing)) 


// router.post("/" , upload.single('listing[image]'),  (req , res) =>{
//     res.send(req.file)
// })

//new route
router.get("/new" ,isLoggedin , listingControler.renderNewForm)

//show route
router.get("/:id" ,wrapAsync(listingControler.showListings))

//edit route
router.get("/:id/edit" ,isLoggedin, isOwner, wrapAsync(listingControler.renderEditForm))

//Update route
router.put("/:id"  ,isLoggedin,  wrapAsync(listingControler.renderUpdate))

//delete route
router.delete("/:id"  ,isLoggedin, isOwner, wrapAsync( listingControler.destroyListing))

module.exports = router;