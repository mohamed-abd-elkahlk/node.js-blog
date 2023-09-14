const router = require("express").Router();

const passport = require("passport");
const { allowedTo } = require("../controller/auth.service");

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
const {
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
} = require("../utils/validation/user");

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

router.use(allowedTo("admin"));

router.patch("/changePassword/:id", updateLoggedUserPassword);
router
  .route("/admin")
  .get(getAllUsers)
  .post(uplaodUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/admin/:id")
  .get(getOneUser)
  .put(uplaodUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
