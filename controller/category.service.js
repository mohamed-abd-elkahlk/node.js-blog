const Category = require("../modules/category.module.js");
const { v4: uuidv4 } = require("uuid");
const factroy = require("./handler.service");
const { uploadSingleImage } = require("../middlewares/image");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Category-${uuidv4()}-${Date.now()}.jpeg`;
  console.log(req.file);
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(1200, 760)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/category/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});
exports.createCategory = factroy.createOne(Category);

exports.updateCategory = factroy.updateOne(Category);

exports.getAllCategory = factroy.getAll(Category);

exports.getOneCategory = factroy.getOne(Category);

exports.deleteCategory = factroy.deleteOne(Category);
