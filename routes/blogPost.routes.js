const router = require("express").Router();
const reviewsRoute = require("./review.routes");
const passport = require("passport");
const {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getOneBlogPost,
  getAllBlogPost,
  uploadBlogPostImage,
  resizeImage,
} = require("../controller/blogPost.service");

const { allowedTo, protect } = require("../controller/auth.service");

const {
  createBlogPostValidator,
  updateBlogPostValidator,
  deleteBlogPostValidator,
  getBlogPostValidator,
} = require("../utils/validation/blogPost");

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
router.use("/:blogPostId/reviews", reviewsRoute);

router
  .get("/", getAllBlogPost)
  .get("/:id", getBlogPostValidator, getOneBlogPost);

router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  }),
  allowedTo("user")
);

router.route("/create").post(createBlogPostValidator, createBlogPost);

router.route("/update/:id").patch(updateBlogPostValidator, updateBlogPost);

router.route("/delete/:id").delete(deleteBlogPostValidator, deleteBlogPost);

router.put("/addimage/:id", uploadBlogPostImage, resizeImage, updateBlogPost);
module.exports = router;
