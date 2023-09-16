







const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8000;
const AdmZip = require("adm-zip")



// Create a directory for storing uploaded files
const uploadDirectory = path.join(__dirname, 'uploadsy');
fs.mkdirSync(uploadDirectory, { recursive: true });
   
// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,uploadDirectory );
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
// const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
 
// Serve uploaded files statically
// app.use('/uploads', express.static('uploads'));

// Endpoint for file upload
app.post('/upload', upload.single('zipFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
// extractor 
// const zipBuffer = req.file.buffer;
// Save the received ZIP file to a local file
// const fs = require('fs');
// fs.writeFileSync('testFile.zip', zipBuffer);

console.log(req.file);


res.status(200).json({ message: 'ZIP file uploaded successfully.' });
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  // return res.send(`File uploaded successfully. You can access it here: ${fileUrl}`);
  console.log(fileUrl);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
