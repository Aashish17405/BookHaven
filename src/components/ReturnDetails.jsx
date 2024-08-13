import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import { toast } from 'react-toastify';
function ReturnDetails() {
    const [bookDetails, setBookdetails] = useState([]);
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
        get_allocation();
        isLoggedIn();
    }, []);

    async function get_allocation() {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/return-details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                toast.error('Error fetching the detils');
            }
            const data = await response.json();
            setBookdetails(data);
            setLoading(false);
            console.log('Fetched book details:', data);
        } catch (err) {
            console.error("Error fetching book allocation", err);
            setLoading(false);
            toast.error('Failed to fetch return book details');
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'book', headerName: 'Book', width: 290 },
        { field: 'name', headerName: 'Name', width: 128 },
        { field: 'phoneNumber', headerName: 'Phone', width: 110 },
        { field: 'Bdatetime', headerName: 'Borrowed Time', width: 160 },
        { field: 'Rdatetime', headerName: 'Returned Time', width: 160 },
    ];
    
    const rows = bookDetails.map((item,index) => ({
        id: item._id,
        book: item.book,
        name: item.name,
        phoneNumber: item.phone,
        Bdatetime: item.borrowedDateTime,
        Rdatetime: item.returnedDateTime,
    }));

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
            {!loading && 
            <div>
                <Navbar />
                <div style={{ height: 600, width: '72%' }}>
                <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                </div>
            </div>}
        </div>
    );
}

export default ReturnDetails;
