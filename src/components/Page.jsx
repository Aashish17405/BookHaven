import React, { useState, useEffect } from 'react';
import Book from './Book';
import PopupForm from './PopupForm';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";

function Page() {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  function isLoggedIn(){
    if(checkAndRemoveExpiredToken()){
      navigate('/');
    };
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/');
    }
  }

  useEffect(() => {
    isLoggedIn();
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/get-books/');
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
    // setInterval(() => {
    //   setShowPopup(false);
    // }, 15000);
  };

  const updateAvailability = (bookId, newAvailable) => {
    books.map(book =>{
      if(book.available-1==newAvailable){
        setShowPopup(true);
      }
    })
    
    setBooks(books.map(book =>
      book._id === bookId ? { ...book, available: newAvailable } : book
    ));
  };

  return (
    <div>
      <Navbar/>
      {showPopup && <PopupForm bookName={bookName}/>}
      {!showPopup && books.map(book => (
        <Book
          key={book._id}
          bookId={book._id}
          name={book.name}
          publicationYear={book.publicationYear}
          author={book.author}
          available={book.available}
          imagesrc={book.img}
          updateAvailability={updateAvailability}
          handleIconClick={handleIconClick}
        />
      ))}
    </div>
  );
}
export default Page;
