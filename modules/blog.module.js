const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

blogPostSchema.virtual("reviews", {
  ref: "reviews",
  foreignField: "blogPost",
  localField: "_id",
});

blogPostSchema.post("init", function (doc) {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/blogpost/${doc.image}`;
    doc.image = imageUrl;
  }
});

blogPostSchema.post("save", function (doc) {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/blogpost/${doc.image}`;
    doc.image = imageUrl;
  }
});

const BlogPost = mongoose.model("blogPost", blogPostSchema);

module.exports = BlogPost;
