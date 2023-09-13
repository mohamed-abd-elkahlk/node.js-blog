const Review = require("../modules/reviews.module");
const factory = require("./handler.service");

// GET /api/blogpost/:blogpost/reviews
exports.createFilterObejct = (req, res, next) => {
  let filter = {};
  if (req.params.blogPostId) {
    filter = { blogpost: req.params.blogPostId };
  }
  req.filterObject = filter;
  next();
};

// Create /api/blogpost/:blogpost/reviews
exports.setBlogPostIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.blogPost) req.body.blogPost = req.params.blogPosytId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.getOneReview = factory.getOne(Review);

exports.getAllReview = factory.getAll(Review);
