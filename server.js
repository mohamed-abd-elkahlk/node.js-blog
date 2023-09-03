const express = require("express");
const app = express();
const dbConnction = require("./config/db");
const morgan = require("morgan");
const globalError = require("./middlewares/Error");

const cookieParser = require("cookie-parser");

// dbconnction
dbConnction();

require("dotenv").config({
  path: "./.env/config.env",
});
// middleware
app.use(express.json());
if (process.env.NODE_ENV === "devlopment") {
  app.use(morgan("dev"));
}
app.use(cookieParser());

// routes
const routes = require("./routes");
app.use("/api", routes);
// routes that are not found in app

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 404));
});
// err handling
app.use(globalError);

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`app run on: http://localhost:${port}`);
});

// handle error outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors ${err.name} || ${err.message}`);
  server.close(() => {
    console.error(`Shtuing down...!`);
    process.exit(1);
  });
});
