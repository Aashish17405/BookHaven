import './App.css'
import Addbook from './components/Addbook'
import Login from './components/Login'
import Page from './components/Page'
import { Routes,Route } from 'react-router-dom'
import Register from './components/Register'
import BookAllocation from './components/BookAllocation'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/home" element={<Page />} />
        <Route path="/add-book" element={<Addbook />} />
        <Route path="/book-allocation" element={<BookAllocation />} />
      </Routes>
    </div>
  )
}

export default App
