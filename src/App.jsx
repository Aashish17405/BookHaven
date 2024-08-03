import './App.css'
import Addbook from './components/Addbook'
import Page from './components/Page'
import { Routes,Route } from 'react-router-dom'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/home" element={<Page />} />
        <Route path="/add-book" element={<Addbook />} />
      </Routes>
    </div>
  )
}

export default App
