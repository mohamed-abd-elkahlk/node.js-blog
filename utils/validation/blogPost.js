const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const User = require("../../modules/user.module");
const Category = require("../../modules/category.module");
const BlogPost = require("../../modules/blog.module");

exports.createBlogPostValidator = [
  check("title")
    .notEmpty()
    .isLength({ min: 3, max: 100 })
    .withMessage("the title length must be bewtewn 3 or 100 chrcter "),
  check("description").notEmpty(),
  check("category")
    .notEmpty()
    .isMongoId()
    .custom((val) =>
      Category.findById(val).then((category) => {
        if (!category) {
          return Promise.reject(new Error("category does not existes"));
        }
      })
    ),
  validatorMiddleware,
];

exports.updateBlogPostValidator = [
  check("id")
    .isMongoId()
    .custom((val, { req }) =>
      BlogPost.findById(val).then((blogPost) => {
        if (!blogPost) {
          return Promise.reject(
            new Error(`this plogpost does not existes \n id:${id}`)
          );
        }
        if (blogPost.author._id.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error("you can't preform this action !!"));
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteBlogPostValidator = [
  check("id")
    .isMongoId()
    .custom((val, { req }) =>
      BlogPost.findById(val).then((blogPost) => {
        if (!blogPost) {
          return Promise.reject(
            new Error(`this plogpost does not existes \n id:${id}`)
          );
        }
        if (blogPost.author._id.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error("you can't preform this action !!"));
        }
      })
    ),
  validatorMiddleware,
];
exports.getBlogPostValidator = [check("id").isMongoId(), validatorMiddleware];
