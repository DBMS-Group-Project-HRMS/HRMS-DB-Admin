import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Header from './HeaderComponent';
import Body from './BodyComponent';


function AdminMain () {

    const [hrm, setHRM] = useState(null);

    return (
        <div>
            <Header hrm={hrm}/>
            <Body setHRM={setHRM}/>
        </div>
    );
}

export default AdminMain;