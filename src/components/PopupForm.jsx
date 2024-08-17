import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import allocation from '../assets/allocation.jpg';

function PopupForm({ bookName, setpopup }) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
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
            toast.warning('All fields are required');
            return;
        }
        try {
            setLoading(true);
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
            setLoading(false);
            toast.success(data.message);
            setpopup(false);
        } catch (error) {
            console.error('Error allocating book:', error);
            setLoading(false);
            toast.error('An error occurred. Please try again.');
        }
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
        <div className="flex items-center justify-center h-screen bg-gray-50">
            
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
                <Navbar />
                {loading && <Lottie options={defaultOptions} height={250} width={250}/>}
            </div>
            
            {!loading && <div className="flex p-14 shadow-md bg-white rounded">
                <h1 className='absolute top-[22rem] sm:top-40 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-center w-full'> BOOK HAVEN </h1>
                <div>
                    <img 
                        src={allocation} 
                        alt="Book Allocation" 
                        className="max-w-sm py hidden sm:block" />
                </div>
                <div className="p-2">
                    <form onSubmit={handleChange}>
                        <h2 className='ml-1 pt-4 text-lg font-medium'>Book Allocation Form</h2>
                        <h3 className='p-2 mt-1 pl-1'>Enter Name</h3>
                        <input 
                                type="text" 
                                placeholder="Name" 
                                autoComplete="off" 
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                onChange={(event) => setName(event.target.value)} 
                            />
                        <h3 className='p-2 mt-2 pl-1'>Enter Phone number</h3>
                        <input 
                                type="number" 
                                placeholder="Phone number" 
                                autoComplete="off" 
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                onChange={(event) => setPhoneNumber(event.target.value)}
                            /><br/>
                        <button 
                            type="submit" 
                            className='p-2 text-base rounded bg-sky-600 text-white mt-8 ml-12 px-12 hover:bg-sky-700' 
                        >
                            Allocate
                        </button>
                    </form>
                </div>
            </div>}
        </div>
    );
}

export default PopupForm;
