const config = require('config');
const multer  = require('multer');
const path = require('path');
//const common = require('./common');



const uploadFile1 = async (req,res,fields,filePath) => {
  try {
    imagesName= [];

   
     timestamp = Math.floor(Date.now()/1000)
    
    return new Promise(function (resolve, reject) {
    const storage =    multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, filePath);
      },
      filename:  function (req, file, callback) {
        callback(null, file.fieldname + '-' + timestamp+ path.extname(file.originalname));
      }
    });

   
  const upload =  multer({ storage : storage}).fields(fields);
  
  upload(req,res,function(err) {
    if(err) {
      reject(err);
    }
    if(req.files.Bills_File == null) {
    imagesName.push({'imageName' :config.defaultImage })

    resolve(imagesName); 
    return;
    }
    for(let i=0;i<req.files.Bills_File.length;i++) {
   
    imagesName.push({'imageName' :  req.files.Bills_File[i].filename})
    if(req.files.thumb == null){
    imagesName.push({'thumbName' : config.defaultThumb})
    }
    else{
  
    imagesName.push({'thumbName' : req.files.thumb[i].filename})
    }
    if(req.files.Bills_File1 == null){
      imagesName.push({'Bills_File1' : config.defaultImage})
      }
      else{
      imagesName.push({'Bills_File1' : filePath + req.files.Bills_File1[i].filename})
      }
      if(req.files.Bills_File2 == null){
        imagesName.push({'Bills_File2' : config.defaultImage})
        }
        else{
        imagesName.push({'Bills_File2' : filePath + req.files.Bills_File2[i].filename})
        }
    }
    resolve(imagesName);
  });
})
  } catch (e) {
    console.log(e);
  }
}



module.exports = {
    uploadFile1
}