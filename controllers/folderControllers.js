const Folder=require("../models/folderModel");
const unzipper=require("unzipper")
const path=require("path")
const fs=require("fs")
module.exports.addFolder=async(req,res,next)=>{

    try {
        console.log("hello tiger");
         
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
          }
        //   console.log(req.file);

            
            const fileUrl = `${req.protocol}://${req.get('host')}/AllFolder/ZipFile/${req.file.filename}`;
            // return res.send(`File uploaded successfully. You can access it here: ${fileUrl}`);
            // console.log(fileUrl);
              // extract zip file
        let folderName=req.file.originalname.slice(0, -4);
        const zipFilePath = `./AllFolder/ZipFile/${req.file.filename}`; // Replace with the path to your ZIP file
        const extractionDir = `./AllFolder`; // Replace with the extraction destination

        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: extractionDir }))
            .on('entry', (entry) => {
                const entryPath = `${extractionDir}/${entry.path}`;
                if (entry.type === 'Directory') {
                    // Create directory if it doesn't exist
                    fs.mkdirSync(entryPath, { recursive: true });
                } else {
                    // Create a write stream for the file
                    const writeStream = fs.createWriteStream(entryPath);
                    entry.pipe(writeStream);
                }
            })
            .on('close', async () => {
                console.log(`ZIP file extracted to ${extractionDir}`);
                // calling folderTraverse
                const folderPathToTraverse = `./AllFolder/${folderName}`;
                folderStructure = buildFolderStructure(folderPathToTraverse);
                console.log(folderStructure);
                const folder=await Folder.create({folderStructure,fileUrl});
                // res.status(200).json({msg:"Profile Created SuccessFully"});
                // return res.json({ success: true, msg: "project upload with info" })
                res.json(folder);

            })
            .on('error', (err) => {
                console.error('Error extracting ZIP file:', err);
            });

        // folder structure 
        function buildFolderStructure(folderPath) {
            const stats = fs.statSync(folderPath);
            if (!stats.isDirectory()) {
                return null; // Not a folder
            }

            const folderName = path.basename(folderPath);
            const children = [];

            const files = fs.readdirSync(folderPath);
            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                const fileStats = fs.statSync(filePath);

                if (fileStats.isDirectory()) {
                    const childFolder = buildFolderStructure(filePath);
                    if (childFolder) {
                        children.push(childFolder);
                    }
                } else if (fileStats.isFile()) {
                    children.push({
                        type: 'file',
                        name: file,
                        path: filePath,
                    });
                }
            });

            return {
                type: 'folder',
                name: folderName,
                children,
            };
        }
    } catch (error) {
        next(error);
    }
}

module.exports.addImage=async(req,res,next)=>{
    try {
        const fileUrl = `${req.protocol}://${req.get('host')}/AllFolder/ZipFile/${req.file.filename}`;
        res.json(fileUrl);
    } catch (error) {
        next(error);
    }
}