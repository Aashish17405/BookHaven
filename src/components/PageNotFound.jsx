import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { useEffect } from "react";
import Navbar from "./Navbar.jsx";
function PageNotFound(){
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
    return <div>
        <Navbar/>
        <h1>Page Not Found</h1>
        <p>The page you requested does not exist.</p>
    </div>
}
export default PageNotFound;