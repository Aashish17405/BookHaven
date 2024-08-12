import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { useNavigate } from 'react-router-dom';

function ReturnDetails() {
    const [bookDetails, setBookdetails] = useState([]);
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
            const response = await fetch('http://localhost:3000/return-details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setBookdetails(data);
            console.log('Fetched book details:', data);
        } catch (err) {
            console.error("Error fetching book allocation", err);
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

    return (
        <>
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
        </>
    );
}

export default ReturnDetails;
