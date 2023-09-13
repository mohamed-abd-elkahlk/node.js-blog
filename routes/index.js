const router = require("express").Router();

const authRouter = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const blogRoutes = require("./blogPost.routes");
const userRoutes = require("./user.routes");
const reviewRoutes = require("./review.routes");

router.use("/auth", authRouter);
router.use("/category", categoryRoutes);
router.use("/blog", blogRoutes);
router.use("/user", userRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
