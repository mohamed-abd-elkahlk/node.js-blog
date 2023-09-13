const mongoose = require("mongoose");
const { promises } = require("nodemailer/lib/xoauth2");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // uniqe: true, //Fixme
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

categorySchema.post("init", function (doc) {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
});

categorySchema.post("save", function (doc) {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
});

const category = mongoose.model("category", categorySchema);

module.exports = category;
