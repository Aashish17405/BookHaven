import { useState,useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';

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
            const response = await fetch("http://localhost:3000/register", {
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
        <div>
            {loading && <Lottie options={defaultOptions} height={400} width={400}/>}
            {!loading && <div>
                <Navbar/>
                <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="username"
                        className="border-black border"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    /><br />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="password"
                        className="border border-black"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    /><br />
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="confirm password"
                        className="border border-black"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    /><br />
                    <button type="submit" className="border border-black rounded p-1">Register</button>
                </form>
            </div>}
        </div>
    );
}

export default Register;
