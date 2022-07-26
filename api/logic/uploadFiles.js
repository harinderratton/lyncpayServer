const multer = require("multer");
const fs = require("fs");

const uploadUserPic = (DIR) => {
  let dir = DIR;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, dir);
    },
    filename: function (req, file, callback) {
      console.log("file.originalname", file.originalname);
      let fileExtn = file.originalname.split(".").pop(-1);
      callback(null, new Date().getTime() + "." + fileExtn);
    },
  });
};

let uploadPic = (DIR) => {
  return multer({ storage: uploadUserPic(DIR) }).single("file");
};

exports.uploadPic = uploadPic;
