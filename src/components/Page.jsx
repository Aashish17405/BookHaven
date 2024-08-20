import React, { useState, useEffect } from 'react';
import Book from './Book';
import PopupForm from './PopupForm';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from 'react-toastify';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import SearchBar from './SearchBar.jsx';
import searchanimation from '../assets/searchanimation.json';
function Page() {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
        const response = await fetch('https://library-management-1-6d7t.onrender.com/get-books');
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
    setShowPopup(true);
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

  const searchAnimationOptions = {
    loop: true,
    autoplay: true, 
    animationData: searchanimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-grow mt-20 px-4 sm:px-8 lg:px-16'>
        
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
            <Lottie options={defaultOptions} height={250} width={250}/>
          </div>
        )}
        {!loading && (
          <>
            {showPopup && <PopupForm bookName={bookName} setpopup={setpopup} />}
            {!showPopup && (
              <>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredBooks.map(book => (
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
                ) : (
                  <div className="flex flex-col justify-center items-center h-64">
                    <Lottie options={searchAnimationOptions} height={200} width={200}/>
                    <p className="text-xl text-gray-600 mt-4">
                      No books found matching your search. Try a different term.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
