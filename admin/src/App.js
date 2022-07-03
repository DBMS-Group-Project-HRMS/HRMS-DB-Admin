import logo from './logo.svg';
import React, {Component} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Header';

import LoginSignup from './components/LoginSignupMainComponent';
import AdminMain from './components/AdminMainComponent';
import Logout from './components/Logout'

function App() {
    return (
        <div>
            <Header />
            <BrowserRouter>
                <div className='App'>
                    <Routes>
                        <Route path="/" element={<LoginSignup/>}></Route>
                        <Route path="/logout" element={<Logout/>}></Route>
                        <Route path="adminDashboard" element={<AdminMain/>}>
                        <Route path="*" element={<LoginSignup/>}></Route>
                            {/* <Route path="" element={<Requests />}></Route>
                            <Route exact path="requests" element={<Requests />}></Route>
                            <Route exact path="vehicledetails" element={<ViewVehicles />}></Route>     */}
                        </Route>
                    </Routes>

                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
