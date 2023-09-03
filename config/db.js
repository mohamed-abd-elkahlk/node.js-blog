const mongoose = require("mongoose");

const dbConnection = () => {
  const uri = process.env.DB_STRING || "mongodb://localhost:27017/blog";
  mongoose
    .connect(uri)
    .then((conn) => {
      console.log(`DB CONNCTED ON: ${conn.connection.host}`);
    })
    .catch((err) => console.log(err));
};

module.exports = dbConnection;
