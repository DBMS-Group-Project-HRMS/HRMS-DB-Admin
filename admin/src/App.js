import logo from './logo.svg';
import React, {Component} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginSignup from './components/LoginSignupMainComponent';
import AdminMain from './components/AdminMainComponent';

function App() {
    return (
        
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path="*" element={<LoginSignup/>}></Route>
                    <Route path="/" element={<LoginSignup/>}></Route>
                    <Route path="adminDashboard" element={<AdminMain/>}>
                        {/* <Route path="" element={<Requests />}></Route>
                        <Route exact path="requests" element={<Requests />}></Route>
                        <Route exact path="vehicledetails" element={<ViewVehicles />}></Route>     */}
                    </Route>
                </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App;
