import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

export function Logout() {
    const navigate = useNavigate();
    sessionStorage.clear();
    useEffect(()=>{
        navigate("/");
    }, []);
}

export default Logout;