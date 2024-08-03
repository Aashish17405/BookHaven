import React, { useState, useEffect } from 'react';
import Book from './Book';
import PopupForm from './PopupForm';
import Navbar from './Navbar';

function Page() {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleIconClick = (name) => {
    setBookName(name);
    setInterval(() => {
      setShowPopup(false);
    }, 15000);
  };

  const updateAvailability = (bookId, newAvailable) => {
    setShowPopup(true);
    setBooks(books.map(book =>
      book._id === bookId ? { ...book, available: newAvailable } : book
    ));
  };

  return (
    <div>
      <Navbar/>
      {showPopup && <PopupForm bookName={bookName}/>}
      {books.map(book => (
        <Book
          key={book._id}
          bookId={book._id}
          name={book.name}
          publicationYear={book.publicationYear}
          author={book.author}
          available={book.available}
          updateAvailability={updateAvailability}
          handleIconClick={handleIconClick}
        />
      ))}
    </div>
  );
}

export default Page;
