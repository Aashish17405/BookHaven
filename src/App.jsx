import './App.css'
import Addbook from './components/Addbook'
import Login from './components/Login'
import Page from './components/Page'
import { Routes,Route } from 'react-router-dom'
import Register from './components/Register'
import DataTable from './components/BookAllocation'
import ReturnDetails from './components/ReturnDetails'
import PageNotFound from './components/PageNotFound'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/home" element={<Page />} />
        <Route path="/add-book" element={<Addbook />} />
        <Route path="/book-allocation" element={<DataTable />} />
        <Route path="/return-details" element={<ReturnDetails />} />
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </div>
  )
}

export default App
