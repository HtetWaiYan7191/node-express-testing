const User = require("./models/user");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const config = require("./config.js");

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = function () {
  const strategy = new Strategy(params, function (payload, done) {
    User.findById(payload.id, function (err, user) {
      if (err) {
        return done(new Error("UserNotFound"), null);
      } else if (payload.expire <= Date.now()) {
        return done(new Error("TokenExpired"), null);
      } else {
        return done(null, user);
      }
    });
  });

  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
  };
};
