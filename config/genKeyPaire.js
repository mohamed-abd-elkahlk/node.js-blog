const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const genKeys = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

const puplicKeyPath = path.join(__dirname, "../.env/id_rsa_pup.pem");
const privteKeyPath = path.join(__dirname, "../.env/id_rsa_priv.pem");

fs.writeFileSync(puplicKeyPath, genKeys.publicKey);
fs.writeFileSync(privteKeyPath, genKeys.privateKey);
