import { useState,useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";

function Addbook() {
    const [bookname, setBookname] = useState('');
    const [author, setAuthor] = useState('');
    const [available, setAvailable] = useState('');
    const [publicationyear, setPublicationyear] = useState('');

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

    useEffect(()=>{
        isLoggedIn();
    },[]);

    const handleChange = async (event) => {
        event.preventDefault();

        try {
            isLoggedIn();
            const response = await fetch('http://localhost:3000/add-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookname,
                    author,
                    available,
                    publicationyear,
                }),
            });

            const data = await response.json();
            console.log(data.message);
            setBookname('');
            setAuthor('');
            setAvailable('');
            setPublicationyear('');
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    return (
        <div>
            <Navbar/>
            <form onSubmit={handleChange}>
                <h1>Add a Book</h1>
                <label>
                    Book Name:
                    <input 
                        type="text" 
                        placeholder="name of the book" 
                        className="border border-black rounded"
                        onChange={(event) => setBookname(event.target.value)} 
                    />
                </label><br />
                <label>
                    No of books available:
                    <input 
                        type="number" 
                        placeholder="no of books available" 
                        className="border border-black rounded"
                        onChange={(event) => setAvailable(event.target.value)} 
                    />
                </label><br />
                <label>
                    Author:
                    <input 
                        type="text" 
                        placeholder="enter the author name" 
                        className="border border-black rounded"
                        onChange={(event) => setAuthor(event.target.value)} 
                    />
                </label><br />
                <label>
                    Publication Year:
                    <input 
                        type="number" 
                        placeholder="publication year" 
                        className="border border-black rounded"
                        onChange={(event) => setPublicationyear(event.target.value)} 
                    />
                </label><br />
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
