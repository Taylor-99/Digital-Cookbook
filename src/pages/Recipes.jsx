import { useState, useEffect } from 'react';
import '../index.css'

function Recipes() {

  const token = localStorage.getItem("token");

  const [recipeData, setRecipeData] = useState([]);
   const [isLoading, setLoading] = useState(true)

  useEffect(() => {

        const fetchRecipes = async () => {
    
            try {
                const response = await fetch('http://localhost:4000/recipe/', {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    }
                });
    
                const data = await response.json()
                setRecipeData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        fetchRecipes();

    }, [token]);

    // console.log(recipeData);
    if (isLoading) return <p>Loading...</p>
    if (!recipeData) return <p>No Recipes to show</p>


  return (
    <div>

      <h1>Recipes Page</h1> 

      <ul>

        {recipeData && recipeData.map((recipe, index) => {
          return (
            <li key={index}>

              <a href={`recipe/${recipe.recipe_id}`}>
                <h2>{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.image}></img>
                <p>Description: {recipe.description}</p>
                <p>Cook Time: {recipe.cook_time} min</p>
                <p>Prep Time: {recipe.prep_time} min</p>
                <p>Serving Size: {recipe.serving_size}</p>
              </a>

              <br></br>

            </li>

          );

        })}
            <li>

              <a href="/addrecipe">
                + Add Recipe
              </a>

            </li>

        </ul>

    </div>
  )
}

export default Recipes