const multer = require("multer");
const fs = require("fs");

const uploadUserPic = (req, DIR) => {
  let dir = DIR;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, dir);
    },
    filename: function (req, file, callback) {
      console.log("file.originalname", file.originalname);
      let fileExtn = file.originalname.split(".").pop(-1);
      callback(null, new Date().getTime() + "." + fileExtn);
    },
  });

  let upload = multer({ storage: storage }).single("file");

  upload(req, res, (err) => {
    return { req: req, res: res, err: err };
  });
};

exports.uploadPic = uploadUserPic;
