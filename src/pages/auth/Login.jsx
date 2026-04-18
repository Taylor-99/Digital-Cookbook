import { useState } from 'react';
import { Route, Routes } from "react-router-dom";

function Login(){
    const [showLogin, setShowLogin] = useState(true)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    return(
        <div>
            <h1>Login</h1>
        </div>
    )
}

export default Login
