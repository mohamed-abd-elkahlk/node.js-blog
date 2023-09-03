const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const privKeyPath = path.join(__dirname, "../../.env/id_rsa_priv.pem");
const pupKeyPath = path.join(__dirname, "../../.env/id_rsa_pup.pem");

const PRIV_KEY = fs.readFileSync(privKeyPath, "utf-8");
const PUP_KEY = fs.readFileSync(pupKeyPath, "utf-8");

const genPasswordHash = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return {
    salt,
    hashedPassword,
  };
};

const verifyPasswordHash = (password, salt, hash) => {
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return passwordHash === hash;
};

const issueJwt = (user) => {
  const id = user._id;
  const expiresIn = "7d";
  const { role } = user;
  const payload = {
    sub: id,
    role,
    iat: Date.now(),
  };
  const token = jwt.sign(payload, PRIV_KEY, { expiresIn, algorithm: "RS256" });
  return token;
};

const varifyToken = (jwtToken) => {
  const decodeToken = jwt.verify(jwtToken, PUP_KEY);
  return decodeToken;
};

const generateMagicLink = (email) => {
  const token = jwt.sign({ email }, PRIV_KEY, {
    algorithm: "RS256",
    expiresIn: "1h",
  });
  return `${process.env.BASE_URL}/api/auth/verify?token=${token}`;
};

module.exports = {
  varifyToken,
  issueJwt,
  verifyPasswordHash,
  genPasswordHash,
  generateMagicLink,
};
