import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Signup(){

    const navigate = useNavigate();

    const [signupData, setSignupData] = useState({
        firstName:'',
        lastName:'',
        username: '',
        password: '',
        confirmPassword:''
    });

    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        event.preventDefault();

        if(signupData.password !== signupData.confirmPassword){
            setError("Passwords do not match");
            return;
        }else{
            try {
                const response = await fetch('http://localhost:4000/auth/signup', 
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signupData),
                });
    
                const data = await response.json();
    
                if(response.ok){
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', data.username);
                    console.log(data.token)
                    navigate('/')
                }else{
                    setError(data.message || 'Registration failed');
                }
    
            }catch (err) {
                setError('Network error: ', + err.message);
                console.error(err);
            }
        }
    };

    const handleChange = (e) => {
        setSignupData({
            ...signupData, 
            [e.target.name]: e.target.value
        })
    }
    
    return(
        <div>
            <h1>Register</h1>
            <section>
                {error && <p>{error}</p>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setError('');
                        handleSignup();
                    }}
                >
                    <label htmlFor="firstName">First Name: </label>
                    <input 
                        type="text" 
                        name="firstName" 
                        placeholder="Enter your first name" 
                        value={signupData.firstName} 
                        onChange={handleChange}
                        required
                    />

                    <br></br>

                    <label htmlFor="lastName">Last Name: </label>
                    <input 
                        type="text" 
                        name="lastName" 
                        placeholder="Enter your last name" 
                        value={signupData.lastName} 
                        onChange={handleChange}
                        required
                    />

                    <br></br>

                    <label htmlFor="username">Username: </label>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Enter your username" 
                        value={signupData.username} 
                        onChange={handleChange}
                        required
                    />

                    <br></br>

                    <label htmlFor="password">Password: </label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter your password" 
                        value={signupData.password} 
                        onChange={handleChange}
                        required
                    />

                     <br></br>

                    <label htmlFor="confirmPassword">confirm Password: </label>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Enter your password" 
                        value={signupData.confirmPassword} 
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

export default Signup