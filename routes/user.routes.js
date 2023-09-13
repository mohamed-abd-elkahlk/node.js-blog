const router = require("express").Router();

const passport = require("passport");
const { allowedTo, protect } = require("../controller/auth.service");

const {
  createUser,
  disableLogedUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  resizeImage,
  updateLoggedUserDate,
  updateLoggedUserPassword,
  updateUser,
  uplaodUserImage,
  getMe,
  getLoggedUserData,
} = require("../controller/user.service");

router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  })
);

router.get("/getme", getMe);
router.patch("/change/Password", updateLoggedUserPassword);
router.put("/update", getLoggedUserData, updateLoggedUserDate);
router.delete("/delete", disableLogedUser);

// router.use(allowedTo("admin"));

router.patch("/changePassword/:id", updateLoggedUserPassword);
router
  .route("/admin")
  .get(getAllUsers)
  .post(uplaodUserImage, resizeImage, createUser);
router
  .route("/admin/:id")
  .get(getOneUser)
  .put(uplaodUserImage, resizeImage, updateUser)
  .delete(deleteUser);

module.exports = router;
