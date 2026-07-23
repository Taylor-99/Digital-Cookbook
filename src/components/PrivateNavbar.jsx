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

  const navItem =
    "px-6 py-3 rounded-t-xl transition-all duration-200";

  return (
    <nav 
      className="
        flex flex-col px-6 py-4
        md:grid md:h-28 md:grid-cols-[auto_1fr_auto]" 
      id="navbar"
    >

      {/* contains the logo for the nav bar and depending on the screen size, will show the hamburger menu to open and close the menu */}
      <div className="flex items-center self-center justify-between w-full md:w-auto md:justify-start" >

        <h1
          className="font-bold text-xl text-center"
        >
          <span id="logo" className="block"> Digital </span>
          <span id="logo" className="block"> Cookbook </span>
        </h1>

        <button
          className="md:hidden text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

      </div>

      {/* If the screen is small then this will convert it to a drop down menu */}
      {open && (
        <ul className="flex flex-col items-center gap-4 py-4 mt-4 bg-[#8a9a5b] w-full md:hidden">
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

                <h2 className="text-xl font-bold mb-4 pl-1">
                  Ready to log off?
                </h2>

                <div className="flex gap-4 items-center">

                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
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

      {/* The list that will show if the screen is normal size (medium size and up) */}
      <ul className="hidden md:flex justify-center self-end gap-4 lg:gap-8 xl:gap-10">

        <li className={`${navItem} ${
              location.pathname === "/"
                ? "bg-[#F4E6C3] font-bold shadow-sm"
                : "bg-[#D8A75B] hover:bg-[#C99243]"
            }`}>
          <Link to="/"> Home </Link>
        </li>

        <li className={`${navItem} ${
              location.pathname === "/recipes"
                ? "bg-[#F4E6C3] font-bold shadow-sm"
                : "bg-[#D8A75B] hover:bg-[#C99243]"
            }`}>
          <Link to="/recipes"> Recipes </Link>
        </li>

        <li className={`${navItem} ${
              location.pathname === "/collections"
                ? "bg-[#F4E6C3] font-bold shadow-sm"
                : "bg-[#D8A75B] hover:bg-[#C99243]"
            }`}>
          <Link to="/collections"> Collections </Link>
        </li>

        <li className={`${navItem} ${
              location.pathname === "/search"
                ? "bg-[#F4E6C3] font-bold shadow-sm"
                : "bg-[#D8A75B] hover:bg-[#C99243]"
            }`}>
          <Link to="/search" > Search </Link>
        </li>
        
      </ul>

      <div className="hidden md:flex flex-col items-end self-center gap-2 pb-2">

        <button 
          onClick={() => setShowLogoutModal(true)}
          className="bg-[#D8A75B] rounded-xl px-4 py-2 text-center transition-colors min-w-32.5  hover:bg-[#8C3E35] hover:font-semibold hover:text-md"
          >
          Logout
        </button>
        
        <a 
          href="/addrecipe" 
          className={`bg-[#D8A75B] rounded-xl px-4 py-2 text-center transition-colors min-w-32.5 whitespace-nowrap ${
            location.pathname === "/addrecipe"
              ? "font-bold"
              : "hover:bg-[#C99243] hover:font-bold hover:text-md"
          }`}
          >
          <span>+ Add Recipe</span>
        </a>

      </div>

        {/* a pop up box to confirm if a user wants to log out or return back to current screen */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white p-10 rounded-lg shadow-lg">

              <h2 className="text-xl font-bold mb-4 pl-4">
                Ready to log off?
              </h2>

              <div className="flex gap-4 items-center">

                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-500 rounded"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>

                {/* if the user chooses to log out, will remove user information from sorege and direct them back to the landing page */}
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
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

    </nav>
  )
}

export default PrivateNavbar