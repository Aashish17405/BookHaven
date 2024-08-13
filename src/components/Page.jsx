import React, { useState, useEffect } from 'react';
import Book from './Book';
import PopupForm from './PopupForm';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from 'react-toastify';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';

function Page() {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function isLoggedIn() {
    if (checkAndRemoveExpiredToken()) {
      navigate('/');
    }
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }

  useEffect(() => {
    isLoggedIn();
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/get-books/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const setpopup = (show) => {
    setShowPopup(show);
  }

  const handleIconClick = (name) => {
    setBookName(name);
    setShowPopup(true); // Show the popup only if we are allocating a book
  };

  const updateAvailability = (bookId, newAvailable) => {
    setBooks(prevBooks => 
      prevBooks.map(book =>
        book._id === bookId ? { ...book, available: newAvailable } : book
      )
    );
  };
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div>
      {loading && <Lottie options={defaultOptions} height={400} width={400}/>}
      {!loading && <div>
        <Navbar />
        {showPopup && <PopupForm bookName={bookName} setpopup={setpopup} />}
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
        </div>}
    </div>
  );
}

export default Page;
