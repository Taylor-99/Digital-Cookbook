import React from 'react'
import { useState } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';

const PrivateNavbar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // for drop down menu
  const [open, setOpen] = useState(false);
  // for pop up box
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <nav className="flex flex-col md:flex-row md:gap-10 lg:gap-25 xl:gap-45" id="navbar" >

      {/* contains the logo for the nav bar and depending on the screen size, will show the hamburger menu to open and close the menu */}

      <div className="flex items-center justify-between gap-62" >

        <h1
          className="flex flex-col text-center font-bold sm:text-2xl md:text-3xl lg:text-4xl"
        >
          <span id="logo-private" > Digital </span>
          <span id="logo-private" > Cookbook </span>
        </h1>

        <button
          className="md:hidden text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

      </div>

      {/* The list that will show if the screen is normal size (medium size and up) */}
      <ul className="hidden md:flex gap-6 text-xs sm:text-sm md:text-xl lg:text-2xl">

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

        <li className="">
          <button onClick={() => setShowLogoutModal(true)}>
            Logout
          </button>
        </li>

        {/* a pop up box to confirm if a user wants to log out or return back to current screen */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white p-10 rounded-lg shadow-lg">

              <h2 className="text-xl font-bold mb-4">
                Ready to log off?
              </h2>

              <div className="flex gap-4 justify-center">

                <button
                  className="bg-gray-300 hover:bg-gray-500 rounded"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>

                {/* if the user chooses to log out, will remove user information from sorege and direct them back to the landing page */}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white rounded"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                >
                  Logout
                </button>

              </div>

            </div>

          </div>
        )}
        
      </ul>

      {/* If the screen is small then this will convert it to a drop down menu */}
      {open && (
        <ul className="flex flex-col items-center gap-4 py-4 bg-[#8a9a5b] md:hidden">
          <li
            className={`w-full text-center rounded-lg ${
              location.pathname === "/"
                ? "bg-[#D8A75B] font-bold"
                : "hover:bg-[#D8A75B] hover:font-bold"
            }`}
          >
            <Link to="/">Home</Link>
          </li>

          <li
            className={`w-full text-center rounded-lg ${
              location.pathname === "/recipes"
                ? "bg-[#D8A75B] font-bold"
                : "hover:bg-[#D8A75B] hover:font-bold"
            }`}
          >
            <Link to="/recipes">Recipes</Link>
          </li>

          <li
            className={`w-full text-center rounded-lg ${
              location.pathname === "/collections"
                ? "bg-[#D8A75B] font-bold"
                : "hover:bg-[#D8A75B] hover:font-bold"
            }`}
          >
            <Link to="/collections">Collections</Link>
          </li>

          <li
            className={`w-full text-center rounded-lg ${
              location.pathname === "/search"
                ? "bg-[#D8A75B] font-bold"
                : "hover:bg-[#D8A75B] hover:font-bold"
            }`}
          >
            <Link to="/search">Search</Link>
          </li>

          <li
            className={`w-full text-center rounded-lg ${
              location.pathname === "/addrecipe"
                ? "bg-[#D8A75B] font-bold"
                : "hover:bg-[#D8A75B] hover:font-bold"
            }`}
          >
            <Link to="/addrecipe">Add Recipe</Link>
          </li>

          <li className="w-full text-center hover:bg-[#A44A3F] hover:rounded-lg hover:font-bold" >
            <button onClick={() => setShowLogoutModal(true)}>
              Logout
            </button>
          </li>

          {showLogoutModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

              <div className="bg-white p-10 rounded-lg shadow-lg">

                <h2 className="text-xl font-bold mb-4">
                  Ready to log off?
                </h2>

                <div className="flex gap-4 justify-center">

                  <button
                    className="bg-gray-300 rounded"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>

                </div>

              </div>

            </div>
          )}
        </ul>
      )}

    </nav>
  )
}

export default PrivateNavbar