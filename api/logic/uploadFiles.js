const config = require('config');
const multer  = require('multer');
const path = require('path');

const uploadUserPic = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, 'data/user/pictures')
  },
  filename: function(req, file, callback) {
       var fileExtn = file.originalname.split('.').pop(-1);
       callback(null, new Date().getTime() + '.' + fileExtn);
      }
});

var uploadPic = multer({ storage: uploadUserPic }).single('file');


module.exports = {
  uploadPic
}