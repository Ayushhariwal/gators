const express = require("express");
const router = express.Router({mergeParams : true})
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require("../Schema.js")
const Review = require("../models/review.js")
var  Listing = require("../models/listing.js")
const {validatereview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const reviewController= require("../controler/reviews");
//review
//post review route
router.post("/" ,validatereview, isLoggedin, wrapAsync(reviewController.cretateReveiw))

//delete review route
router.delete("/:reviewId" ,isLoggedin,isReviewAuthor, wrapAsync(reviewController.destroyReveiwRoute))

module.exports = router;