
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return ( 
    <>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        
      </Routes>
    </Router>
    </>
  );
}

export default App;
