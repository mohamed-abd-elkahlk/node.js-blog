const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../modules/user.module");
const { ApiError } = require("../utils/utils");

const {
  issueJwt,
  verifyPasswordHash,
  varifyToken,
  generateMagicLink,
} = require("../utils/auth/utils");

const sendEmail = require("../utils/emails/utiles");

// auth services

const signup = asyncHandler(async (req, res, next) => {
  const user = User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) {
    return next(new ApiError("error when create email", 500));
  }
  const magicLink = generateMagicLink(req.body.email);

  const message = `
  <html>
<head>
  <title>Verify Your Signup</title>
</head>
<body>
  <h1>Verify Your Signup</h1>
  <p>Hi ${req.body.name},</p>
  <p>Thank you for signing up for our service!</p>
  <p>To verify your signup, please click on the following link:</p>
  <button ><a href=${magicLink}>verify</a></button>
  <p>This link will only be valid for 1 hour.</p>
  <p>Thanks,</p>
  <p>The team at app</p>
</body>
</html>
  `;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "verify your signup",
      message,
    });

    res.status(201).json({
      succes: true,
      emial: `cheke your inbox for this email ${req.body.email}`,
    });
  } catch (err) {
    return next(new ApiError(err, 500));
  }
});

const varifyMagicLink = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  try {
    const decodedToken = varifyToken(token);
    const user = await User.findOne({ email: decodedToken.email });
    // console.log(user);
    const dateNow = parseInt(Date.now() / 1000, 10);
    // console.log(dateNow);
    // console.log(decodedToken.exp);
    if (dateNow > decodedToken.exp) {
      return next(new ApiError("token expired", 404));
    }

    user.isVarvaid = true;
    await user.save();
    res.status(200).json({ succes: true, message: "Verified" });
  } catch (err) {
    return next(new ApiError(err, 500));
  }
});

const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const verifyPassword = verifyPasswordHash(
    req.body.password,
    user.salt,
    user.password
  );

  if (!verifyPassword) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  if (!user.isVarvaid) {
    return next(new ApiError("user not varfid cheack your email", 401));
  }
  // TODO: see the user info
  const token = issueJwt(user);
  res
    .status(200)
    .cookie("jwt", token, { sameSite: "Strict", httpOnly: true })
    .json({ data: user });
});

const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

const forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`there no user for this email:${req.body.email}`));
  }

  const resetcode = Math.floor(100000 + Math.random() * 900000).toString();
  const hasedRestCode = crypto
    .createHash("sha256")
    .update(resetcode)
    .digest("hex");

  user.passwordResetCode = hasedRestCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>resetCode</title>
  </head>
  
  <body>
      <h1>rest code</h1>
      <p>Hi ${user.name} <br> We received a request to reset the password on your Short url Account.</p>
      <h1>${resetcode}</h1>
      <p>Enter this code to complete the reset.</p>
      <p>Thanks for helping us keep your account secure. <br> The Short url Team</p>
  </body>
  
  </html>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res.status(200).json({
    status: "success",
    message: `Reset code sent to email: ${req.body.email}`,
  });
});

const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hasedRestCode = crypto
    .createHash("sha256")
    .update(req.body.resetcode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hasedRestCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user.passwordResetVerified) {
    return next(new ApiError("reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = issueJwt(user);
  res
    .status(200)
    .cookie("jwt", token, { httpOnly: true, sameSite: "strict" })
    .json({ token });
});

const logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return new ApiError("you are not loged in so you can't logout");
  }
  res
    .clearCookie("jwt")
    .status(200)
    .json({ succes: true, message: "you logout" });
});

module.exports = {
  signup,
  varifyMagicLink,
  login,
  allowedTo,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
  logout,
};
