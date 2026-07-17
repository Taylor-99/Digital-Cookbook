import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Login(){

    const navigate = useNavigate();

    // holds information for login
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    // eror handling
    const [error, setError] = useState('');

    // handles login information
    const handleLogin = async () => {

        // send data to backend
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

            // retrieves data from backend
            const data = await response.json();

            if(response.ok){

                // set local storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', data.username);

                // navigate to home screen
                navigate('/')
            }else{
                setError(data.message || 'login failed');
            }

        }catch (err) {
            setError('Network error: ', + err.message);
            console.error(err);
        }
    };

    // adds user input to login data variables
    const handleChange = (e) => {
        setLoginData({
            ...loginData, 
            [e.target.name]: e.target.value
        })
    }
    
    return(

        <div className="flex flex-col items-center justify-center">

            <div className="size-96 fixed top-36 bg-yellow-50 rounded-2xl shadow-md flex flex-col items-center justify-center">

                <div className="flex flex-col items-center">
                    <h1 className="text-2xl text-[#4A2C2A]">Login</h1>
                    
                    <br></br>

                    <section>
                        {error && <p className="text-red-600 text-xl">{error}</p>}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setError('');
                                handleLogin()
                            }}
                        >
                            <label htmlFor="username" className="text-[#4A2C2A]">Username: </label>
                            <input 
                                type="text" 
                                name="username" 
                                placeholder="Enter your username" 
                                value={loginData.username} 
                                onChange={handleChange}
                                required
                                className="flex bg-slate-50 outline-1 outline-offset-1 rounded-sm w-56"
                            />

                            <br></br>

                            <label htmlFor="password" className="text-[#4A2C2A]">Password: </label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Enter your password" 
                                value={loginData.password} 
                                onChange={handleChange}
                                required
                                className="flex bg-slate-50 outline-1 outline-offset-1 rounded-sm w-56"
                            />

                            <br></br>
                            <br></br>

                            <input 
                                type="submit" 
                                value="LogIn"
                                className="bg-[#6E8B5B] hover:bg-[#5E774D] w-20 h-9 ml-18"
                            />

                        </form>

                    </section>

                </div>

            </div>
        </div>
    )
}

export default Login
