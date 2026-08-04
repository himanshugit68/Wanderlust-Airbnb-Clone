const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const{listingSchema,reviewSchema } = require("./schema.js");

module.exports.isloggedIn = (req,res,next)=>{
    //console.log(req);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner =async (req,res,next)=>{
    let {id} = req.params;
    // if (req.body.listing.image) {
    //     req.body.listing.image = { url: req.body.listing.image };
    // }
    let listing = await Listing.findById(id);
    if( !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error","you are not the owner of this listing ");
            return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor =async (req,res,next)=>{
    let {id,reviewId} = req.params;
    // if (req.body.listing.image) {
    //     req.body.listing.image = { url: req.body.listing.image };
    // }
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
            req.flash("error","you are not the author of this review");
            return res.redirect(`/listings/${id}`);
    }
    next();
};