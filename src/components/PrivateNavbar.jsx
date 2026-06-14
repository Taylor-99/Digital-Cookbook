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
    <nav className="flex items-center gap-5 md:gap-32 lg:gap-40 xl:gap-56" id="navbar" >

      <h1
        className="flex flex-col text-center font-bold sm:text-xl md:text-2xl lg:text-3xl"
      >
        <span id="logo" >Digital</span>
        <span id="logo" >Cookbook</span>
      </h1>

      <ul className="flex gap-2 md:gap-5 lg:gap-6 text-xs sm:text-sm md:text-base lg:text-lg">

        <li>
          <a href="/"> Home </a>
        </li>

        <li>
          <a href="/recipes"> Recipes </a>
        </li>

        <li>
          <a href="/collections"> Collections </a>
        </li>

        <li >
          <a href="/search" > Search </a>
        </li>

        <li>
          <a href="/addrecipe" >Add Recipe</a>
        </li>

        <li>
          < input 
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