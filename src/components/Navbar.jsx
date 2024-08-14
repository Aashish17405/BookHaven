import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../server/tokenService";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="shadow-md bg-gray-900 fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4">
            <button 
                onClick={() => navigate('/home')}
                className="text-white font-medium hover:text-gray-300"
            >
                Home icon
            </button>
            
            <div className="hidden md:flex space-x-4">
                <button 
                    onClick={() => navigate('/add-book')}
                    className="text-white font-medium hover:text-gray-300"
                >
                    Add book
                </button>
                <button 
                    onClick={() => navigate('/book-allocation')}
                    className="text-white font-medium hover:text-gray-300"
                >
                    Book Allocation
                </button>
                <button 
                    onClick={() => navigate('/return-details')}
                    className="text-white font-medium hover:text-gray-300"
                >
                    Return details
                </button>
                <button 
                    onClick={() => {
                        removeToken();
                        window.location.reload();
                    }}
                    className="text-white font-medium hover:text-gray-300"
                >
                    Logout
                </button>
                <button 
                    onClick={() => navigate('/register')}
                    className="text-white font-medium hover:text-gray-300"
                >
                    Register
                </button>
            </div>

            {/* Dropdown menu for small screens */}
            <div className="sm:hidden relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white font-medium hover:text-gray-300"
                >
                    Menu
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-gray-900 text-white rounded shadow-lg z-50">
                        <button 
                            onClick={() => { navigate('/home'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                        >
                            Home
                        </button>
                        <button 
                            onClick={() => { navigate('/add-book'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                        >
                            Add Book
                        </button>
                        <button 
                            onClick={() => { navigate('/book-allocation'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                        >
                            Book Allocation
                        </button>
                        <button 
                            onClick={() => { navigate('/return-details'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                        >
                            Return Details
                        </button>
                        <button 
                            onClick={() => { removeToken(); window.location.reload(); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                        >
                            Logout
                        </button>
                        <button 
                            onClick={() => { navigate('/register'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
