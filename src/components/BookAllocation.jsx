import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';

function DataTable() {
    const [bookDetails, setBookdetails] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

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
            console.log('Fetched book details:', data);
        } catch (err) {
            console.error("Error fetching book allocation", err);
        }
    }

    const handleDelete = async () => {
        try {
            console.log('Selected rows:', selectedRows);
            if (selectedRows.length === 0) {
                alert('No rows selected');
                return;
            }

            const deleteRequests = selectedRows.map(async (rowId) => {
                const rowData = bookDetails.find(row => row._id === rowId);
                console.log('Deleting row:', rowData);
                if (rowData) {
                    await fetch('http://localhost:3000/delete-book', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            book: rowData.book,
                            name: rowData.name
                        })
                    });
                }
            });

            await Promise.all(deleteRequests);

            get_allocation();
            setSelectedRows([]);
        } catch (err) {
            console.error("Error deleting entries", err);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'book', headerName: 'Book', width: 290 },
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'phoneNumber', headerName: 'Phone', width: 110 },
        { field: 'datetime', headerName: 'Borrowed Time', width: 160 },
    ];
    
    const rows = bookDetails.map((item,index) => ({
        id: item._id,
        book: item.book,
        name: item.name,
        phoneNumber: item.phone,
        datetime: item.borrowedDateTime,
    }));

    return (
        <>
            <Navbar />
            <div style={{ height: 450, width: '63%' }}>
            <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    rowSelectionModel={selectedRows}
                    onRowSelectionModelChange={(newSelectionModel) => {
                        setSelectedRows(newSelectionModel);
                    }}
                />
                <button onClick={handleDelete}>Delete Selected</button>
            </div>
        </>
    );
}

export default DataTable;
