const router = require("express").Router();

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
// TODO:  add some validation to auth route

router.post("/signup", signup);
router.get("/verify", varifyMagicLink);
router.post("/login", login);
router.post("/forgotPassword", forgetPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.patch("/resetPassword", resetPassword);
router.use(protect);
router.post("/logout", logout);

module.exports = router;
