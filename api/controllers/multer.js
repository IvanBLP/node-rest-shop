//Multer SetUp for storing images
const multer = require('multer');

//In const Storage we configure how the files are stored.
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //Location for the incoming image
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    // Name for the stored image
    cb(null, new Date().toISOString() + file.originalname);
  }
});

//In the file Filter we make sure we only accept .jpeg and .png files
const fileFilter = (req, file, cb) => {
  //reject files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//Initializing Multer, passing the declared above configurations above
const upload = multer({
  storage: storage,
  limits: {
    // Accepting files up to 5MB in size
    filesize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

module.exports= upload;
