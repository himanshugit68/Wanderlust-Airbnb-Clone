const Listing = require("../models/listing");

//index route
module.exports.index = async (req,res)=>{
    let { category } = req.query;
    //console.log(req.query.category);

    let allListings;
    const validCategories = [
        "trending",
        "rooms",
        "iconic-cities",
        "mountains",
        "castles",
        "pools",
        "camping",
        "farms",
        "arctic",
        "domes",
        "boats"    
    ];
    if(category && validCategories.includes(category)) {
        allListings = await Listing.find({ category });
    } else {
        allListings = await Listing.find({});
    }
   
    res.render("listings/index.ejs", { allListings,category });
};

//new route
module.exports.renderNewForm = (req,res,next)=>{
    res.render("listings/new.ejs"); 

};

//show route
module.exports.showListing = async (req,res)=>{ 
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
    path:"reviews",
    populate:{
     path:"author",
    
    },
    })
    .populate("owner");

    if(!listing) {
        req.flash("error","listing you requested for doesn't exist!");
        return res.redirect("/listings");

    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
    
};

//create route
module.exports.createListing = async(req,res)=>{   
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.category = req.body.listing.category.toLowerCase().trim();
    newListing.owner = req.user._id;

    newListing.image = {url, filename};

    await newListing.save();
    req.flash("success","new listing added");
    res.redirect("/listings");
  
};

//edit route
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","listing you requested for doesn't exist!");
        return res.redirect("/listings");

    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit",{ listing,originalImageUrl });

};

//update route
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
    if(typeof req.file !=="undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename };
        await listing.save();
    }
    
    req.flash("success","listing updated");
    // res.redirect("/listings");
    res.redirect(`/listings/${id}`);

};

//delete route
module.exports.destroyListing = async (req,res)=>{
     let {id} = req.params;
     let deleteListing =await Listing.findByIdAndDelete(id);
    // console.log(deleteListing);
     req.flash("success","listing deleted");
     res.redirect("/listings");
    
};