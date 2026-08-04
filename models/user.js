const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose.default);  //plugin use- Add this functionality to my model without writing everything again.”
//plugin used in schema not model

module.exports = mongoose.model("User",userSchema);


