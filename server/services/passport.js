const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const config = require("../config");

const localOptions = {
    usernameField: "email"
};
const localLogin = new LocalStrategy(localOptions,
    function (email, password, done) {
        User.findOne({ email }, function (error, user) {
            if (error) {
                return done(error);
            }
            if (!user) {
                return done(null, false);
            }
            user.comparePassword(password, function (error, isMatch) {
                if (error) {
                    return done(error);
                }
                if (!isMatch) {
                    return done(null, false);
                }
                return done(null, user);
            });
        });
    });

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions,
    //run all time when user login
    //payload - decrypted token {sub: ..., iat: ...}
    function (payload, done) {
        User.findById(payload.sub, function (error, user) {
            if (error) {
                return done(error, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });

passport.use(jwtLogin);
passport.use(localLogin);