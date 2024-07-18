import { useState, useEffect } from 'react';
import Book from './Book';
function Page(){
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
    
    return <div>
          {books.map(book => (
              <Book name={book.name} author={book.author} publicationYear={book.publicationYear} available={book.available}/>
          ))}
    </div>
}

export default Page;