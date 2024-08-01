import React from 'react';
import { TiMinus } from "react-icons/ti"; 
import { FaPlus } from "react-icons/fa6";

function Book({ bookId, name, publicationYear, author, available, updateAvailability }) {
  const handleChange = (value) => {
    const newAvailable = available + value;
    const payload = { bookId, available: newAvailable };
    console.log('Payload being sent:', payload);

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
        updateAvailability(bookId, newAvailable);
      })
      .catch(error => console.error('Error updating availability:', error));
  };

  return (
    <div className="p-3 w-80 h-50">
      <div className="relative w-64 h-64">
        <img src="/photo.jpg" className="rounded w-full h-full" alt="Description of the image" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 bg-black bg-opacity-50">
          <button
            className="bg-blue-500 text-white py-2 px-4 m-2 rounded"
            onClick={() => handleChange(-1)}
          >
            <TiMinus />
          </button>
          <div className="text-white">
            Available:{available}
          </div>
          <button
            className="bg-green-500 text-white py-2 px-4 m-2 rounded"
            onClick={() => handleChange(1)}
          >
            <FaPlus />
          </button>
        </div>
      </div>
      <div>
        {name} ({publicationYear})
      </div>
      <div>
        Author: {author}
      </div>
    </div>
  );
}

export default Book;
