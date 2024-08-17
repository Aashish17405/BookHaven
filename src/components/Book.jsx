import React from 'react';
import { TiMinus } from "react-icons/ti"; 
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import { useState } from 'react';

function Book({ imagesrc, bookId, name, publicationYear, author, available, updateAvailability, handleIconClick }) {
  const [loading,setLoading] = useState(false);
  
  const handleChange = (value) => {
    if (available <= 0 && value < 0) {
      toast.error('No more available books to allocate.');
      return;
    }

    const newAvailable = available + value;
    if (newAvailable < 0) {
      toast.error('Available count cannot be negative.');
      return;
    }

    const payload = { bookId, available: newAvailable };
    console.log('Payload being sent:', payload);
    setLoading(true);

    fetch('https://library-management-1-6d7t.onrender.com/update-book-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response data:', data);
        setLoading(false);
        updateAvailability(bookId, newAvailable); 
        if (value < 0) {
          handleIconClick(name);
        }
      })
      .catch(error => console.error('Error updating availability:', error));
      setLoading(false);
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
    <div className="flex flex-col w-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      
      {loading && <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
        <Lottie options={defaultOptions} height={250} width={250} />
      </div>}
      
      {!loading && (
        <div>
          <div className="relative aspect-[3/4] overflow-hidden">
            <img 
              src={imagesrc} 
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg" 
              alt={name} 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 bg-black bg-opacity-50">
              <div className="text-white text-center">
                <div>Available: {available}</div>
                <button
                  className="bg-blue-500 text-white py-2 px-4 m-2 rounded hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => handleChange(-1)}
                >
                  <TiMinus />
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 flex-grow">
            <h3 className="font-bold text-base mb-1 line-clamp-2 h-12">{name}</h3>
            <p className="text-sm text-gray-600 mb-1">{publicationYear}</p>
            <p className="text-sm text-gray-600 truncate">{author}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Book;
