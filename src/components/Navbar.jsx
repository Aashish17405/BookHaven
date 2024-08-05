import { useNavigate } from "react-router-dom";
import { removeToken } from "../../server/tokenService";
function Navbar(){
    const navigate = useNavigate();
    return <div>
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/add-book')}>Add a book</button>
        <button onClick={() => {
            removeToken();
            window.location.reload();
        }}>Logout</button>
    </div>
}
export default Navbar;