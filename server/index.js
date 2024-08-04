require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt=require("jsonwebtoken");
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const { emailSchema,passwordSchema } = require('./zod');
const { Book, Image, Borrower,Users } = require('./db');

const jwtPassword=process.env.JWT_SECRET;
const expiryTime = 20;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
// const mongoURI = process.env.MONGODB_URI;

// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error("MongoDB connection error: " + err));

function jwtSign(req, res, next) {
  const { username, password } = req.body;

  const usernameResponse = emailSchema.safeParse(username);
  const passwordResponse = passwordSchema.safeParse(password);

  if (!usernameResponse.success || !passwordResponse.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const token = jwt.sign({ id: usernameResponse.data }, jwtPassword,{expiresIn:expiryTime});
  res.locals.token = token;
  next();
}


app.post('/', jwtSign, async (req, res) => {
  console.log('Received a POST request at /');
  console.log(req.body);
  const user = new Users({ username: req.body.username, password: req.body.password});
  await user.save();
  res.json({ token: res.locals.token });
});

app.get('/get-books', async (req, res) => {
  console.log('Received a GET request at /get-books');
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error while fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/update-book-availability', async (req, res) => {
  const { bookId, available } = req.body;

  if (!bookId || available === undefined) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    const book = await Book.findByIdAndUpdate(
      bookId,
      { available },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/add-book', async (req, res) => {
  console.log('called /add-book');
  console.log('Request Body:', req.body);
  try {
    const { bookname, author, available, publicationyear } = req.body;
    if (!bookname || !available || !author || !publicationyear) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newBook = new Book({ name:bookname, available:available , author:author, publicationYear:publicationyear });
    await newBook.save();
    res.status(200).json({ message: 'Successfully added a book' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'An error occurred while adding the book' });
  }
});

app.post('/allocate-book', async (req, res) => {
  console.log('called /allocate-book');
  console.log('Request Body:', req.body);
  try {
    const { name, phone, bookName } = req.body;
    if (!name || !phone || !bookName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newBorrower = new Borrower({ book:bookName, name, phone });
    await newBorrower.save();
    res.status(200).json({ message: 'Successfully allocated the book' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'An error occurred while allocating the book' });
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
    console.error('Error while fetching images:', error);
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
    console.error('Error while uploading image:', error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
  