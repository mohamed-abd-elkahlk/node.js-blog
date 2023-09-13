const { check, checkSchema, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const Category = require("../../modules/category.module");

exports.createCategoryValidator = [
  body("name")
    .notEmpty()
    .isLength({ min: 3, max: 30 })
    .custom((val, { req }) =>
      Category.findOne({ name: val }).then((category) => {
        console.log(req.body);
        if (category) {
          return Promise.reject(new Error("category name must be unqie"));
        }
      })
    ),
  check("description").notEmpty().isLength({ min: 10, max: 100 }),
  checkSchema({ image: {} }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("name")
    .optional()
    .isLength({ min: 3, max: 30 })
    .custom((val) =>
      Category.findOne({ name: val }).then((category) => {
        if (category) {
          return Promise.reject(new Error("category name must be unqie"));
        }
      })
    ),
  check("description").optional().isLength({ min: 10, max: 100 }),
  validatorMiddleware,
];

exports.getCategoryValidator = [check("id").isMongoId(), validatorMiddleware];

exports.deleteCategoryValidator = [
  check("id").isMongoId(),
  validatorMiddleware,
];
