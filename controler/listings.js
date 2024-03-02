const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken : mapToken });

module.exports.index =  async (req, res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs" , {allListings})
}

module.exports.renderNewForm =  (req , res) =>{
    
    res.render("listings/new.ejs") 
}

module.exports.showListings =  async(req , res) =>{
    let {id} = req.params; 
    const listing = await Listing.findById(id).populate({path :"reviews" , populate :{path : "author"} }).populate("owner")
    
    res.render("listings/show.ejs" , {listing});
 }

 module.exports.createListing = async(req , res) =>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    
    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;

    newListing.geometry = response.body.features[0].geometry
    
    let savedListing = await newListing.save();

    console.log(savedListing)
    req.flash("success" , "New listing created!")
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req , res) =>{ 
    let {id} = req.params; 
    const listing = await Listing.findById(id)

    if(!listing){
        req.flash("error" , "Listing you requested for doesn't exist!")
        res.redirect("/listings")
         }
 
    res.render("listings/edit.ejs" , {listing})
}

module.exports.renderUpdate = async(req , res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing})
    req.flash("success" , "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async(req , res) =>{
    let {id} = req.params; 
    let deletedId = await Listing.findByIdAndDelete(id)
    console.log(deletedId)
    req.flash("success" , "Listing deleted Successfully!")
    res.redirect("/listings")
}
