require('dotenv').config();
const express=require("express");
const folderRoutes=require("./routes/folderRoutes");
const mongoose=require("mongoose");
const cors=require("cors");

const app=express();
app.use(cors());
app.use(express.static("File"));
app.use("/api",folderRoutes);

// Set up the MongoDB connection pool
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,  
  // Adjust the pool size as needed
};

mongoose.connect(process.env.MONGO_URL, mongoOptions);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const server=app.listen(process.env.PORT,()=>{
  console.log("server runing in port",process.env.PORT);
})