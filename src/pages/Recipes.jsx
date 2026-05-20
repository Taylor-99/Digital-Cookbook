import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import '../index.css'

function Recipes() {

  let navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [recipeData, setRecipeData] = useState([]);
   const [isLoading, setLoading] = useState(true)

  useEffect(() => {

        const fetchRecipes = async () => {

          // console.log("in fetch")
    
            try {
                const response = await fetch('http://localhost:4000/recipe/', {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    }
                });
    
                const data = await response.json()
                // console.log(data)
                setRecipeData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error.message);
            }finally{
              setLoading(false);
            }
        };

        fetchRecipes();

    }, [token]);

    // console.log(recipeData);
    if (isLoading) return <p>Loading...</p>
    if (!isLoading && recipeData.length === 0) {
      return <p>No Recipes to show</p>
    }

  return (
    <div>

      <h1>Recipes Page</h1> 

      <ul>

        {recipeData && recipeData.map((recipe, index) => {
          return (
            <li key={index}>

              <Link to={`/recipe/${recipe.recipe_id}`}>
              
                <h2>{recipe.title}</h2>

                <img src={recipe.image} alt={recipe.image}></img>

                <p><span>Description: </span>{recipe.description}</p>

                <p><span>Cook Time: </span>{recipe.cook_time} min</p>

                <p><span>Prep Time: </span>{recipe.prep_time} min</p>

                <p><span>Serving Size: </span>{recipe.serving_size}</p>

              </Link>

              <br></br>

            </li>

          );

        })}
            <li>

      <button onClick={() => navigate('/addrecipe')}>
        + Add Recipe
      </button>

            </li>

        </ul>

    </div>
  )
}

export default Recipes