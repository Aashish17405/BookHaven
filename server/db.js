const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://Aashish17405:Aashish17@cluster0.muslifi.mongodb.net/Library-Management');

const imageSchema = new mongoose.Schema({
    name: String,
    img: {
      data: Buffer,
      contentType: String,
    },
});

const Image = mongoose.model('Image', imageSchema);

const bookSchema = new mongoose.Schema({
    name:String,
    available:Number,
    author:String,
    publicationYear:Number
})

const Book = mongoose.model('Book',bookSchema);

const borrowerSchema = new mongoose.Schema({
    book: String,
    name: String,
    phone: Number,
})

const Borrower = mongoose.model('Borrower',borrowerSchema);

module.exports = {
    Book,Image,Borrower
};