const BlogPost = require("../modules/blog.module");
const factory = require("./handler.service");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/image");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils/utils");
const User = require("../modules/user.module");
const sharp = require("sharp");

// Upload single image
exports.uploadBlogPostImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `BlogPost-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(1200, 760)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/blogpost/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

exports.createBlogPost = asyncHandler(async (req, res, next) => {
  req.body.author = req.user._id;
  const blogpost = await BlogPost.create(req.body);
  if (!blogpost) {
    return next(new ApiError("intrnal server error ", 500));
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { posts: blogpost._id },
  });

  res.status(201).json({ data: blogpost });
});

exports.updateBlogPost = factory.updateOne(BlogPost);

exports.deleteBlogPost = asyncHandler(async (req, res, next) => {
  req.body.author = req.user._id;
  const { id } = req.params;
  const blogpost = await BlogPost.findByIdAndDelete(id);

  if (!blogpost) {
    return next(new ApiError(`no blog post with this id: ${id}`, 404));
  }

  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { posts: id },
  });

  res.status(204).send();
});

exports.getOneBlogPost = factory.getOne(BlogPost);

exports.getAllBlogPost = factory.getAll(BlogPost);
