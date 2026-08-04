const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../Controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); // now it store image in cloudinary storage



//index and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isloggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
);
// .post(upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// });


//new route
router.get("/new",isloggedIn,(listingController.renderNewForm));

//edit route
router.get("/:id/edit", 
    isloggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

//show and update route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isloggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(
    isloggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));




module.exports = router;