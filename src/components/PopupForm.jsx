import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";

function PopupForm({ bookName, setpopup }) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
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
    }, []);

    const handleChange = async (event) => {
        event.preventDefault();
        if (!name || !phoneNumber) {
            setError('All fields are required');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/allocate-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookName: bookName,
                    name: name,
                    phone: phoneNumber,
                })
            });
            const data = await response.json();
            alert(data.message);
            setpopup(false);
        } catch (error) {
            console.error('Error allocating book:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-2 border border-green-500">
                <form onSubmit={handleChange}>
                    <h1 className="ml-10">Book Allocation Form</h1>
                    <label>
                        Name:
                        <input 
                            type="text" 
                            placeholder="Name" 
                            autoComplete="off" 
                            className="border rounded border-black pl-1" 
                            onChange={(event) => setName(event.target.value)} 
                        />
                    </label><br />
                    <label>
                        Phone:
                        <input 
                            type="tel" 
                            placeholder="Phone number" 
                            autoComplete="off" 
                            className="border rounded border-black pl-1" 
                            onChange={(event) => setPhoneNumber(event.target.value)}
                        />
                    </label><br />
                    {error && <div className="text-red-500">{error}</div>}
                    <button 
                        type="submit" 
                        className="ml-20 border border-black flex items-center"
                    >
                        Allocate
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PopupForm;
