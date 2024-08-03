import { useNavigate } from "react-router-dom";
function Navbar(){
    const navigate = useNavigate();
    return <div>
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/add-book')}>Add a book</button>
        <button onClick={() => navigate('/')}>Logout</button>
    </div>
}
export default Navbar;