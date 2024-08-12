import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Addbook() {
    const [bookname, setBookname] = useState('');
    const [author, setAuthor] = useState('');
    const [available, setAvailable] = useState('');
    const [publicationyear, setPublicationyear] = useState('');
    const [image, setImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (checkAndRemoveExpiredToken()) {
            navigate('/');
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = async (event) => {
        event.preventDefault();
        if (!bookname || !author || !available || !publicationyear || !image) {
            toast.error('All fields are required');
            return;
        }

        if (parseInt(available) <= 0) {
            toast.warning('Number of available books must be positive');
            return;
        }

        const currentYear = new Date().getFullYear();
        if (parseInt(publicationyear) > currentYear) {
            toast.warning('Publication year cannot be in the future');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('bookname', bookname);
        formData.append('author', author);
        formData.append('available', available);
        formData.append('publicationyear', publicationyear);

        try {
            const response = await fetch('http://localhost:3000/add-book', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            toast.success('New Book uploaded successfully');
            setBookname('');
            setAuthor('');
            setAvailable('');
            setPublicationyear('');
            setImage(null);
        } catch (error) {
            console.error("Error adding book:", error);
            toast.error('Failed to add book. Please try again.');
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div>
            <Navbar />
            <form onSubmit={handleChange}>
                <h1>Add a Book</h1>
                <label>
                    Book Name:
                    <input 
                        type="text" 
                        placeholder="name of the book" 
                        className="border border-black rounded"
                        onChange={(event) => setBookname(event.target.value)} 
                        value={bookname}
                    />
                </label><br />
                <label>
                    No of books available:
                    <input 
                        type="number" 
                        placeholder="no of books available" 
                        className="border border-black rounded"
                        onChange={(event) => setAvailable(event.target.value)} 
                        value={available}
                    />
                </label><br />
                <label>
                    Author:
                    <input 
                        type="text" 
                        placeholder="enter the author name" 
                        className="border border-black rounded"
                        onChange={(event) => setAuthor(event.target.value)} 
                        value={author}
                    />
                </label><br />
                <label>
                    Publication Year:
                    <input 
                        type="number" 
                        placeholder="publication year" 
                        className="border border-black rounded"
                        onChange={(event) => setPublicationyear(event.target.value)} 
                        value={publicationyear}
                    />
                </label><br />
                <input type="file" onChange={handleImageChange} required />
                <button 
                    type="submit"
                    className="border border-black rounded"
                >
                    Add Book
                </button>
            </form>
        </div>
    );
}

export default Addbook;