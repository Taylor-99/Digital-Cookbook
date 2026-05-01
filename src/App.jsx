import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";

import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import ProtectedRoute from './components/Protectedroute';

import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import Recipes from "./pages/Recipes"
import Collections from "./pages/Collections"
import Search from "./pages/Search"
import AddRecipe from "./pages/AddRecipe"
import ViewRecipe from "./pages/ViewRecipes"
import EditRecipe from "./pages/EditRecipe"
import CreateCollection from "./pages/CreateCollection"

function App() {

  return (
    <div>
        <Routes>
          
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>


          <Route
            element={
              <ProtectedRoute>
                <PrivateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/addrecipe" element={<AddRecipe />} />
            <Route path="/recipe/:recipeID" element={<ViewRecipe />} />
            <Route path="/recipe/edit/:recipeID" element={<EditRecipe />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/createcollection" element={<CreateCollection />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
    </div>
  );
}

export default App;