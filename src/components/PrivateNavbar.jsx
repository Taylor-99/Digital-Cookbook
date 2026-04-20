import React from 'react'
import { useNavigate } from 'react-router-dom';

const PrivateNavbar = () => {

  const navigate = useNavigate();


  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
    };

  return (
    <nav>

    <h1>Digital Cookbook</h1>
    <ul >
      <li><a href="/">Home</a></li>
      <li><a href="/recipes">Recipes</a></li>
      <li><a href="/collections">Collections</a></li>
      <li><a href="/search">Search</a></li>
      <li><a href="/addrecipe">Add Recipe</a></li>
      <li>< input 
              type="button"
              onClick={() => {
                  handleLogout(); 
              }}
              value = "Logout"
        />
      </li>
    </ul>
  </nav>
  )
}

export default PrivateNavbar