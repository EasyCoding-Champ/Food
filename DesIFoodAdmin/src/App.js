import './App.css';
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Navbar from './components/NavBar';
import About from './components/About';
import Signup from './components/Signup';
import Home from './components/Home';
import Alert from './components/Alert';
import UserLogin from './components/UserLogin';
import FoodState from './context/food/FoodState';
import Notes from './components/Notes';
import CustomerOrder from './components/CustomerOrder';
function App() {
  const[alert,setAlert]=useState(null);
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
        setAlert(null);
    }, 1500);
}
  return (
    <>
      <FoodState>
        <Router>
          <Navbar />
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert}/>} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/fooditem" element={<Notes />} />
              <Route exact path="/myorder" element={<CustomerOrder />} />
              <Route exact path="/login" element={<UserLogin showAlert={showAlert}/>} />
              <Route exact path="/signup" element={<Signup showAlert={showAlert}/>} />
            </Routes>
          </div>
        </Router>
      </FoodState>
    </>
  );
}

export default App;
