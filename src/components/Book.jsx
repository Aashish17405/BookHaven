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

    fetch('http://localhost:3000/update-book-availability', {
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
    <div className="p-3 w-96 h-50">
      {loading && <Lottie options={defaultOptions} height={400} width={400}/>}
      {!loading && 
      <>
        <div className="relative w-64 h-64">
          <img src={imagesrc} className="rounded w-full h-full" alt={name} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 bg-black bg-opacity-50">
            <div className="text-white">
              Available: {available}
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 m-2 rounded"
              onClick={() => handleChange(-1)} // Decrease availability and show popup if necessary
            >
              <TiMinus />
            </button>
          </div>
        </div>
          <div>
            {name} ({publicationYear})
          </div>
          <div>
            Author: {author}
          </div>
      </>}
    </div>
  );
}

export default Book;
