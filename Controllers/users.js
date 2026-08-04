const User = require("../models/user");
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
       // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) {
                next(err);
            } else {
                req.flash("success","Welcome back to Wanderlust!");
                res.redirect("/listings");
            }
        });
       

    } catch(err) {
        req.flash("error",err.message);
        res.redirect("/signup")
    }


};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
        req.flash("success","Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings"

         if (redirectUrl.includes("/reviews/")) {
      const parts = redirectUrl.split("/");
      const listingId = parts[2]; // extract :id from /listings/:id/reviews/:reviewId
      redirectUrl = `/listings/${listingId}`;
    }
        res.redirect(redirectUrl);  //***************res.locals.redirectUrl  */
    };

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err) {
            return next(err);
        } else {
            req.flash("success","you are logged out!");
            res.redirect("/listings");
        }
    });
};