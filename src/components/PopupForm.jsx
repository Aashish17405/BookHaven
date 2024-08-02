import { useState } from "react";

function PopupForm({ bookName }) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleChange = async () => {
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
            console.log(data.message);
            alert(data.message);
        } catch (error) {
            console.error('Error allocating book:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-2 border border-green-500">
                <h1 className="ml-10">Book Allocation Form</h1>
                <label>
                    Name:
                    <input 
                        type="text" 
                        placeholder="name" 
                        autoComplete="none" 
                        className="border rounded border-black pl-1" 
                        onChange={(event) => setName(event.target.value)} 
                    />
                </label><br />
                <label>
                    Phone:
                    <input 
                        type="tel" 
                        placeholder="Phone number" 
                        autoComplete="none" 
                        className="border rounded border-black pl-1" 
                        onChange={(event) => setPhoneNumber(event.target.value)}
                    />
                </label><br />
                <button 
                    className="ml-20 border border-black flex items-center" 
                    onClick={() => handleChange()}
                >
                    Allocate
                </button>
            </div>
        </div>
    );
}

export default PopupForm;
