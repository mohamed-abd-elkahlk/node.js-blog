const mongoose = require("mongoose");
const { genPasswordHash } = require("../utils/auth/utils");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "first name required !"],
  },

  email: {
    type: String,
    required: [true, "email name required !"],
  },
  password: {
    type: String,
  },
  salt: String,

  passwordChangedAt: Date,

  passwordResetCode: String,

  passwordResetExpires: Date,

  passwordResetVerified: Boolean,

  isVarvaid: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: {
    type: String,
  },
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const password = genPasswordHash(this.password);
  this.password = password.hashedPassword;
  this.salt = password.salt;

  next();
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
