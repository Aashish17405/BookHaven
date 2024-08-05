require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt=require("jsonwebtoken");
const multer = require('multer');
const { emailSchema,passwordSchema } = require('./zod');
const { Book,Borrower,Users } = require('./db');

const jwtPassword=process.env.JWT_SECRET;
const expiryTime = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

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
  const {username, password} = req.body;
  const user = await Users.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (user.password != password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ token: res.locals.token });
  await user.save();
  res.json({ token: res.locals.token });
});

app.post('/register', async (req, res) => {
  console.log('Received a POST request at /register');
  console.log(req.body);
  const { username, password } = req.body;
  
  const usernameResponse = emailSchema.safeParse(username);
  const passwordResponse = passwordSchema.safeParse(password);

  if (!usernameResponse.success || !passwordResponse.success) {
    return res.status(401).json({ message: 'Invalid input' });
  }

  const user = new Users({ username: req.body.username, password: req.body.password});
  await user.save();
  res.json({ message: "New User created succesfully" });
});

app.get('/get-books', async (req, res) => {
  console.log('Received a GET request at /get-books');
  try {
    const books = await Book.find();
    // Convert image data to Base64
    const booksWithImages = books.map(book => ({
      ...book.toObject(),
      img: book.img ? `data:${book.img.contentType};base64,${book.img.data.toString('base64')}` : null
    }));
    res.json(booksWithImages);
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

    res.status(200).json(book);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/add-book', upload.single('image'), async (req, res) => {
  console.log('called /add-book');
  console.log('Request Body:', req.body);
  try {
    const { bookname, author, available, publicationyear } = req.body;
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    if (!bookname || !available || !author || !publicationyear) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newBook = new Book({ name:bookname, available:available , author:author, publicationYear:publicationyear, img: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    }, });
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

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
  