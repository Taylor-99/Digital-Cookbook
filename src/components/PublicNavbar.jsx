import React from 'react'

const PublicNavbar = () => {
  return (
    <nav className="pt-2 flex justify-between">

      {/* contains the logo for the nav bar header */}

      <div>

        <h1
          className="pl-6 text-[#4A2C2A] font-bold sm:text-2xl md:text-3xl lg:text-4xl flex flex-col"
        >
          <span id="logo" > Digital </span>
          <span id="logo" > Cookbook </span>
        </h1>

      </div>

      {/* Contains the links to switch between loging in and signing up */}

      <div>

        <ul className="pr-14 pt-4 flex gap-4">
          <li className="text-[#4A2C2A] hover:text-[#5E774D]"><a href="/login">Log In</a></li>
          <li className="text-[#4A2C2A] hover:text-[#5E774D]"><a href="/signup">Sign Up</a></li>
        </ul>

      </div>

  </nav>
  )
}

export default PublicNavbar