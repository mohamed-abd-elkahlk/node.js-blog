const router = require("express").Router();

const passport = require("passport");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getOneCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controller/category.service");

const {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validation/category");
const { protect, allowedTo } = require("../controller/auth.service");

router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  allowedTo("admin")
);

router
  .route("/")
  .post(
    // FIXME: when i use the valditor it return error
    createCategoryValidator,
    createCategory
  )
  .get(getAllCategory);

router
  .route("/:id")
  .patch(updateCategoryValidator, updateCategory)
  .get(getCategoryValidator, getOneCategory)
  .delete(deleteCategoryValidator, deleteCategory);

router.put("/add/:id", uploadCategoryImage, resizeImage, updateCategory);

module.exports = router;
