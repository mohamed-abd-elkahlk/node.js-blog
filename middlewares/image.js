const multer = require("multer");

const multeroOprions = () => {
  const muletrStorge = multer.memoryStorage();
  const multerFiletr = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };

  const upload = multer({ storage: muletrStorge, fileFilter: multerFiletr });
  return upload;
};

exports.uploadSingleImage = (fildName) => multeroOprions().single(fildName);
