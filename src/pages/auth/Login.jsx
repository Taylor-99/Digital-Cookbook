import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Login(){

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleLogin = async () => {
        // event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/auth/login', 
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if(response.ok){
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', data.username);
                // console.log(data.token)
                navigate('/')
            }else{
                setError(data.message || 'login failed');
            }

        }catch (err) {
            setError('Network error: ', + err.message);
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setLoginData({
            ...loginData, 
            [e.target.name]: e.target.value
        })
    }
    
    return(
        <div>
            <h1>Login</h1>
            <section>
                {error && <p>{error}</p>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setError('');
                        handleLogin()
                    }}
                >
                    <label htmlFor="username">Username: </label>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Enter your username" 
                        value={loginData.username} 
                        onChange={handleChange}
                        required
                    />

                    <br></br>

                    <label htmlFor="password">Password: </label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter your password" 
                        value={loginData.password} 
                        onChange={handleChange}
                        required
                    />

                    <br></br>
                    <br></br>

                    <input 
                        type="submit" 
                        value="LogIn"
                    />
                </form>
            </section>
        </div>
    )
}

export default Login
