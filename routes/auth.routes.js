const router = require("express").Router();

const passport = require("passport");
const {
  forgetPassword,
  login,
  resetPassword,
  varifyMagicLink,
  signup,
  verifyPassResetCode,
  logout,
  protect,
} = require("../controller/auth.service");

const { loginValidator, signupValidator } = require("../utils/validation/auth");
router.post("/signup", signupValidator, signup);
router.get("/verify", varifyMagicLink);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgetPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.patch("/resetPassword", resetPassword);
router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  })
);
router.post("/logout", logout);

module.exports = router;
