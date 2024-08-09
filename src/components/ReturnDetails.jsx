import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';

function ReturnDetails() {
    const [bookDetails, setBookdetails] = useState([]);

    useEffect(() => {
        get_allocation();
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
        { field: 'name', headerName: 'Name', width: 100 },
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
            <div style={{ height: 450, width: '69%' }}>
            <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </div>
        </>
    );
}

export default ReturnDetails;
