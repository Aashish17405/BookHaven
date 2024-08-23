require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt=require("jsonwebtoken");
const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const multer = require('multer');
const { emailSchema,passwordSchema } = require('./zod');
const { Book,Borrower,Users,Returner } = require('./db');

const jwtPassword=process.env.JWT_SECRET;
var salt = bcrypt.genSaltSync(10);
const expiryTime = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

function get_time(){
  let now = new Date();
  let hours = now.getHours();
  if(hours<10){
    hours = '0' + hours;
  }
  let minutes = now.getMinutes();
  if(minutes<10){
    minutes = '0' + minutes;
  }
  let seconds = now.getSeconds();
  if(seconds<10){
    seconds = '0' + seconds;
  }

  let time = hours + ':' + minutes + ':' + seconds;
  return time;
}

function get_date(){
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' +  yyyy;
  return today;
}

async function jwtSign(req, res, next) {
  const { username, password } = req.body;
  
  const usernameResponse = emailSchema.safeParse(username);
  const passwordResponse = passwordSchema.safeParse(password);

  if (!usernameResponse.success || !passwordResponse.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const user = await Users.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if(!bcrypt.compareSync(password, user.password)){
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: usernameResponse.data }, jwtPassword,{expiresIn:expiryTime});
  res.locals.token = token;
  next();
}

app.post('/', jwtSign, async (req, res) => {
  console.log('Received a POST request at /');
  const { username, password } = req.body;
  try {
    const token = res.locals.token;
    res.json({ token });
    
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/register', async (req, res) => {
  console.log('Received a POST request at /register');
  const { username, password } = req.body;
  const existingUser = await Users.findOne({ username });
  if(existingUser){
    return res.status(409).json({ message: 'Username already exists' });
  }
  
  const usernameResponse = emailSchema.safeParse(username);
  const passwordResponse = passwordSchema.safeParse(password);

  if (!usernameResponse.success || !passwordResponse.success) {
    return res.status(401).json({ message: 'Invalid input' });
  }
  var hashpwd = bcrypt.hashSync(password, salt);

  const user = new Users({ username: req.body.username, password: hashpwd});
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

app.post('/add-book', upload.single('image'), async (req, res) => {
  console.log('called /add-book');
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
  try {
    const { name, phone, bookName } = req.body;
    if (!name || !phone || !bookName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    let DateTime = get_time();
    DateTime = DateTime+'-'+get_date();
    const updatedBook = await Book.findOne({name: bookName});
    await Book.updateOne({ name: bookName }, { $inc: { available: -1 } });
    const newBorrower = new Borrower({ book:bookName, name, phone, borrowedDateTime:DateTime });
    await newBorrower.save();
    res.status(200).json({ message: 'Successfully allocated the book' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'An error occurred while allocating the book' });
  }
});

app.get('/book-allocation', async (req, res) => {
  console.log('called /book-allocation');
  try{
    const borrowers = await Borrower.find();
    res.status(200).json(borrowers);
  }catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'An error occurred while fetching book allocation details' });
  }
});

app.post('/return-book', async (req, res) => {
  console.log('Received a POST request at /return-book');
  const { book, name} = req.body;
  try {
    let DateTime = get_time();
    DateTime = DateTime+'-'+get_date();
    const borrower = await Borrower.findOne({ book: book, name: name });
    const updatedBook = await Book.findOne({name: book});
    await Book.updateOne({ name: book }, { $inc: { available: 1 } });
    const returner = new Returner({ ...borrower.toObject(), returnedDateTime: DateTime });
    await returner.save();
    const deleteResult = await Borrower.deleteOne({ book: book, name: name });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No matching borrower found' });
    }
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting document' });
  }
});

app.get('/return-details', async (req, res) => {
  console.log('called /return-details');
  try{
    const returner = await Returner.find();
    res.status(200).json(returner);
  }catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'An error occurred while fetching book allocation details' });
  }
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
  