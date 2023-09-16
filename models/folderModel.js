const mongoose=require("mongoose");


const folderSchema=new mongoose.Schema({
    fileUrl:String,
     folderStructure:{
        type: mongoose.Schema.Types.Mixed,
     },
})

module.exports=mongoose.model("Folder",folderSchema);