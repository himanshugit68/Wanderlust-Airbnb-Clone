const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=> {
    //console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);  //reviews array in schema await newReview.save();
    await listing.save();
    req.flash("success","new Review Created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
        let { id,reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review Deleted");

        res.redirect(`/listings/${id}`);
    };