const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id, // token subject
        iat: timestamp // issued at time
    }, config.secret);
}

exports.signin = function (req, res, next) {
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = function (req, res, next) {
    const reqBody = req.body;
    const email = reqBody.email;
    const password = reqBody.password;
    if (!(email && password)) {
        return res.status(422)
            .send({
                error: "You must provide email and password"
            });
    }
    User.findOne({ email }, function (error, existingUser) {
        if (error) {
            return next(error);
        }
        if (existingUser) {
            return res.status(422).send({
                error: "Email is in use"
            });
        }
        const user = new User({
            email: email,
            password: password
        });
        user.save(function (error) {
            if (error) {
                return next(error);
            }
            res.json({
                token: tokenForUser(user)
            });
        });
    });
}