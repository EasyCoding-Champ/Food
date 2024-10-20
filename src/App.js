import React from 'react';
import './App.css';
import Home from './screen/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './screen/Login';
import Signup from './screen/SignUp.js';
import Alert from './components/Alert.js';
import { useState } from 'react';
import FoodState from './context/food/FoodState.js';
import MyOrder from './screen/MyOrder.js';
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
    <FoodState>
    <Router>
    <Alert alert={alert}/>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route exact path="/login" element={<Login showAlert={showAlert}/>}/>
          <Route exact path="/signup" element={<Signup showAlert={showAlert}/>}/>
          <Route exact path="/myorder" element={<MyOrder />} />
        </Routes>
      </div>
    </Router>
    </FoodState>
  );
}

export default App;
