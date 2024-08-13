import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { checkAndRemoveExpiredToken } from '../../server/tokenService.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';

function DataTable() {
    const [bookDetails, setBookdetails] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
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
            const response = await fetch('http://localhost:3000/book-allocation', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setBookdetails(data);
            setLoading(false);
            console.log('Fetched book details:', data);
        } catch (err) {
            console.error('Error fetching book allocation', err);
            toast.error('Failed to fetch updated book details');
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            console.log('Selected rows:', selectedRows);
            if (selectedRows.length === 0) {
                toast.warning('No rows selected');
                return;
            }

            const deleteRequests = selectedRows.map(async (rowId) => {
                const rowData = bookDetails.find(row => row._id === rowId);
                console.log('Deleting row:', rowData);
                if (rowData) {
                    await fetch('http://localhost:3000/return-book', {
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
            setLoading(false);
            toast.success('Book returned successfully');
            get_allocation();
            setSelectedRows([]);
        } catch (err) {
            console.error('Error:', err);
            setLoading(false);
            toast.error('Some error occurred. Please try again');
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'book', headerName: 'Book', width: 290 },
        { field: 'name', headerName: 'Name', width: 125 },
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

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <>
        {loading && <Lottie options={defaultOptions} height={400} width={400}/>}
        {!loading && 
            <div>
                <Navbar />
                <div style={{ height: 600, width: '65%' }}>
                <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        rowSelectionModel={selectedRows}
                        onRowSelectionModelChange={(newSelectionModel) => {
                            setSelectedRows(newSelectionModel);
                        }}
                    />
                    <button onClick={handleDelete}>Mark as returned</button>
                </div>
            </div>}
        </>
    );
}

export default DataTable;
