const express=require("express");
const path=require("path");
const fs=require("fs");
const { addFolder,addImage } = require("../controllers/folderControllers");
const multer=require("multer");

const router=express.Router();

// Create a directory for storing uploaded files
const uploadDirectory = path.join(__dirname, '../AllFolder/ZipFile');
fs.mkdirSync(uploadDirectory, { recursive: true });
   
// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,uploadDirectory );
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
// const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/addfolder",upload.single("folder"),addFolder);
router.post("/addimg",upload.single("image"),addImage)
module.exports=router;