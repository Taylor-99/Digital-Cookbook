import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Signup(){

    const navigate = useNavigate();

    //saves data for signup
    const [signupData, setSignupData] = useState({
        firstName:'',
        lastName:'',
        username: '',
        password: '',
        confirmPassword:''
    });

    const [error, setError] = useState('');

    //handles the signup data
    const handleSignup = async (e) => {
        e.preventDefault();

        //checks the password to make sure they match before before submitting the data to the backend
        if(signupData.password !== signupData.confirmPassword){

            setError("Passwords do not match");
            return;

        }else{

            try {
                //sends the signup information to the backend to save the new user
                const response = await fetch('http://localhost:4000/auth/signup', 
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signupData),
                });
    
                //retrieves the user data from the backend
                const data = await response.json();
    
                //sets the user data in local storage to access throughout the app
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

    //sets the data the user enters into the variables for the signup data
    const handleChange = (e) => {
        setSignupData({
            ...signupData, 
            [e.target.name]: e.target.value
        })
    }
    
    return(
        <div className="flex flex-col items-center justify-center">

            <div className="w-96 h-148 fixed top-36 bg-yellow-50 rounded-2xl shadow-md flex flex-col items-center justify-center">

                <h1 className="text-2xl text-[#4A2C2A]">Register</h1>

                <br></br>

                <section>
                    {error && <p className="text-red-600 text-xl">{error}</p>}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setError('');
                            handleSignup();
                        }}
                    >
                        <label htmlFor="firstName" className="text-[#4A2C2A]">First Name: </label>
                        <input 
                            type="text" 
                            name="firstName" 
                            placeholder="Enter your first name" 
                            value={signupData.firstName} 
                            onChange={handleChange}
                            required
                            className="flex bg-slate-50 outline-1 outline-offset-1 rounded-sm w-56"
                        />

                        <br></br>

                        <label htmlFor="lastName" className="text-[#4A2C2A]">Last Name: </label>
                        <input 
                            type="text" 
                            name="lastName" 
                            placeholder="Enter your last name" 
                            value={signupData.lastName} 
                            onChange={handleChange}
                            required
                            className="flex bg-slate-50 outline-1 outline-offset-1 rounded-sm w-56"
                        />

                        <br></br>

                        <label htmlFor="username" className="text-[#4A2C2A]">Username: </label>
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Enter your username" 
                            value={signupData.username} 
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
                            value={signupData.password} 
                            onChange={handleChange}
                            required
                            className="flex bg-slate-50 outline-1 outline-offset-1 rounded-sm w-56"
                        />

                        <br></br>

                        <label htmlFor="confirmPassword" className="text-[#4A2C2A]">Confirm Password: </label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Enter your password" 
                            value={signupData.confirmPassword} 
                            onChange={handleChange}
                            required
                            className="flex bg-slate-50 outline-1 outline-offset-1 rounded-sm w-56"
                        />

                        <br></br>
                        <br></br>

                        <input 
                            type="submit" 
                            value="Signup"
                            className="bg-[#6E8B5B] hover:bg-[#5E774D] w-20 h-9 ml-18"
                        />
                    </form>
                </section>
            </div>
        </div>
    )
}

export default Signup