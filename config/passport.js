const passport = require("passport");
const fs = require("fs");
const path = require("path");
const User = require("../modules/user.module");
const jwtStrategy = require("passport-jwt").Strategy;

const pupKeyPath = path.join(__dirname, "../.env/id_rsa_pup.pem");
const PUP_KEY = fs.readFileSync(pupKeyPath, "utf-8");

const cookiesExtractor = (req) => {
  let token;
  if (!req.cookies.jwt) {
    token = null;
    return token;
  }
  token = req.cookies.jwt;
  return token;
};

const strategy = new jwtStrategy(
  {
    jwtFromRequest: cookiesExtractor,
    secretOrKey: PUP_KEY,
    algorithms: ["RS256"],
  },
  (pyload, done) => {
    User.findById(pyload.sub)
      .then((user) => {
        if (!user) {
          return done(new Error("user not found try to regiseter"), false);
        }
        return done(null, user);
      })
      .catch((err) => done(err, false));
  }
);

module.exports = strategy;
