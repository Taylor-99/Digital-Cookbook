import React from 'react'

const PrivateNavbar = () => {
  return (
    <nav>

    <h1>Digital Cookbook</h1>
    <ul >
      <li><a href="/">Home</a></li>
      <li><a href="/recipes">Recipes</a></li>
      <li><a href="/collections">Collections</a></li>
      <li><a href="/search">Search</a></li>
      <li><a href="/addrecipe">Add Recipe</a></li>
      <li><a href="/logout">Logout</a></li>
    </ul>
  </nav>
  )
}

export default PrivateNavbar