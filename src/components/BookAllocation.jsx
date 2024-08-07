import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState,useEffect } from 'react';
import Navbar from './Navbar';

function DataTable() {
    const [bookDetails, setBookdetails] = useState([]);

    useEffect(() => {
        get_allocation();
    }, []);

    async function get_allocation() {
        try {
            const response = await fetch('http://localhost:3000/book-allocation', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setBookdetails(data);
            console.log(data);
        } catch (err) {
            console.error("Error fetching book allocation", err);
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 20 },
        { field: 'book', headerName: 'Book', width: 290 },
        { field: 'name', headerName: 'Name', width: 140 },
        { field: 'phoneNumber', headerName: 'Phone', width: 110 },
    ];
    
    const rows = bookDetails.map((item, index) => ({
        id: index + 1,
        book: item.book,
        name: item.name,
        phoneNumber: item.phone,
    }));

    return (
        <>
            <Navbar/>
            <div style={{ height: 450, width: '45%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
        </>
    );
}

export default DataTable;
