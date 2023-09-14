const router = require("express").Router({ mergeParams: true });
const passport = require("passport");
// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
const {
  createReview,
  updateReview,
  deleteReview,
  getOneReview,
  getAllReview,
  createFilterObejct,
  setBlogPostIdAndUserIdToBody,
} = require("../controller/reviewes.service");
const { allowedTo, protect } = require("../controller/auth.service");

const {
  createReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
  updateReviewValidator,
} = require("../utils/validation/review");

router
  .route("/")
  .get(createFilterObejct, getAllReview)
  .post(
    passport.authenticate("jwt", {
      session: false,
      ignoreExpiration: false,
      userProperty: "user",
    }),
    setBlogPostIdAndUserIdToBody,
    allowedTo("user"),
    createReviewValidator,
    createReview
  );

router.use(
  passport.authenticate("jwt", {
    session: false,
    ignoreExpiration: false,
    userProperty: "user",
  })
);

router
  .route("/:id")
  .get(getOneReview)
  .patch(allowedTo("user"), updateReviewValidator, updateReview)

  .delete(allowedTo("user", "admin"), deleteReviewValidator, deleteReview);

module.exports = router;
