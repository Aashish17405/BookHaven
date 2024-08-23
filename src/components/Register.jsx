import { useState,useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import register from '../assets/register.png';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    async function handleSubmit(event) {
        event.preventDefault();

        if(!username || !password || !confirmPassword) {
            toast.warning('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            toast.warning('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("https://library-management-1-6d7t.onrender.com/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setLoading(false);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                toast.success(data.message);
            } else {
                setLoading(false);
                toast.error(data.message);
            }
        } catch (e) {
            console.log(e.message);
            toast.error('Something went wrong Please try again later');
            setLoading(false);
        }
    }

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='bg-gray-50'>
            
            {loading && <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                <Navbar />
                <Lottie options={defaultOptions} height={250} width={250}/>
            </div>}
            
            {!loading && <div>
                <Navbar />
                <div className='flex justify-center h-screen items-center '>
                <div className='flex p-6 rounded-xl shadow-xl bg-white'>
                    <h1 className='absolute top-34 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-center w-full'> BOOK HAVEN </h1>
                    <div className='p-10 rounded mt-6'>
                        <form onSubmit={handleSubmit}>
                            <h2 className='ml-1 text-lg font-medium'>Register a new user</h2>
                            <h3 className='p-2 mt-2 pl-1'>Enter Username</h3>
                            <input
                                type="text"
                                placeholder="username"
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            /><br />
                            <h3 className='p-2 pl-1'>Enter Password</h3>
                            <input
                                type="password"
                                placeholder="password"
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            /><br />
                            <h3 className='p-2 pl-1'>Confirm Password</h3>
                            <input
                                type="password"
                                placeholder="confirm password"
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                            /><br />
                            <button type="submit" className='p-2 text-base rounded bg-sky-600 text-white mt-8 ml-8 px-16 hover:bg-sky-700'>Register</button>
                        </form>
                    </div>
                    <div className='rounded'>
                    <img 
                        src={register} 
                        alt='register image' 
                        className='hidden sm:block rounded mt-10 pb-6' 
                        width={400}/>
                    </div>
                </div>
                </div>
            </div>}
        </div>
    );
}

export default Register;
