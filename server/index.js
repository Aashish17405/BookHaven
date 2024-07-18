require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const { Book, Image } = require('./db'); // Ensure both models are correctly imported

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error("MongoDB connection error: " + err));

app.get('/', async (req, res) => {
  console.log('Received a GET request at /'); // Debugging line
  try {
    const books = await Book.find();
    console.log('Books found:', books); // Debugging line
    res.json(books);
  } catch (error) {
    console.error('Error while fetching books:', error); // Debugging line
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    const formattedImages = images.map(image => ({
      _id: image._id,
      name: image.name,
      img: `data:${image.img.contentType};base64,${image.img.data.toString('base64')}`
    }));
    res.status(200).json(formattedImages);
  } catch (error) {
    console.error('Error while fetching images:', error); // Debugging line
    res.status(500).send(error.message);
  }
});


app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const newImage = new Image({
      name: req.body.name,
      img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await newImage.save();
    res.status(201).send('Image uploaded successfully');
  } catch (error) {
    console.error('Error while uploading image:', error); // Debugging line
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
  