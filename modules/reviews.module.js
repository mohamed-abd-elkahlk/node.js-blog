const mongoose = require("mongoose");
const BlogPost = require("./blog.module");
const reviweSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },

    blogPost: {
      type: mongoose.Schema.ObjectId,
      ref: "blogPost",
      required: true,
    },
  },
  { timestamps: true }
);

reviweSchema.statics.calcAvgRatingsAndQuntaty = async function (blogPostId) {
  const result = await this.aggregate([
    { $match: { blogPost: blogPostId } },
    {
      $group: {
        _id: "blogPost",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  console.log(result.length);

  if (result.length > 0) {
    await BlogPost.findByIdAndUpdate(blogPostId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await BlogPost.findByIdAndUpdate(blogPostId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviweSchema.post("save", async function () {
  await this.constructor.calcAvgRatingsAndQuntaty(this.blogPost);
});

reviweSchema.post("remove", async function () {
  await this.constructor.calcAvgRatingsAndQuntaty(this.blogPost);
});

reviweSchema.post("init", async function () {
  await this.constructor.calcAvgRatingsAndQuntaty(this.blogPost);
});

const Review = mongoose.model("review", reviweSchema);

module.exports = Review;
