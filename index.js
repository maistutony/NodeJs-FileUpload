//mongoDB connection and server creation
const express = require('express')
const mongoose=require("mongoose");
const app = express()
require("dotenv").config();
const cors = require("cors")
const fs = require("fs")
const multer = require("multer");
//MongoDB connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL_STRING, {
  useNewUrlParser: true
}).then(
  console.log("connected to db")
).catch((err)=>{
  console.log(err)
})
const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  path: String,
  // Add other properties you want to save
});
const fileModel =mongoose.model("File", fileSchema);
//middlewares
app.use(cors());
app.use(express.json())
// Serve static files (e.g., HTML form for uploading)
 app.use(express.static("public"));
// Set up middleware for handling form data
const upload = multer({ dest: 'profile/' });


app.post("/profile", upload.single("file"), async (req, res) => {
  console.log(req.file)
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    // Create a new document for the uploaded file
    const uploaded=await fileModel.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });
    res.send(uploaded)
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
    }
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
});