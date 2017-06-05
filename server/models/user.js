const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
});
//run before save model
userSchema.pre("save", function (next) {
    const user = this;
    // generate a salt then run callback
    bcrypt.genSalt(10, function (error, salt) {
        if (error) {
            return next(error);
        }
        // hash our password using the salt
        bcrypt.hash(user.password, salt, null, function (error, hash) {
            if (error) {
                return next(error);
            }
            user.password = hash;
            // go and save model
            next();
        });
    });
});
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (error, isMatch) {
        if (error) {
            return callback(error);
        }
        callback(null, isMatch);
    });
}
const ModelClass = mongoose.model("user", userSchema);
module.exports = ModelClass;