import React, { useState, useEffect } from 'react';
import Book from './Book';


function Page() {
  const [books, setBooks] = useState([]);

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

  const updateAvailability = (bookId, newAvailable) => {
    setBooks(books.map(book => {
      if (book._id === bookId) {
        return { ...book, available: newAvailable };
      }
      return book;
    }));
  };

  return (
    <div>
      {books.map(book => (
        <Book
          key={book._id}
          bookId={book._id}
          name={book.name}
          author={book.author}
          publicationYear={book.publicationYear}
          available={book.available}
          updateAvailability={updateAvailability}
        />
      ))}
    </div>
  );
}

export default Page;
