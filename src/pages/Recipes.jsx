import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import '../index.css'
import apiLogo from './assets/images/spoonacular_logo.svg'

function Recipes() {

  let navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [recipeData, setRecipeData] = useState([]);
  const [isLoading, setLoading] = useState(true);

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

      <br></br>
      <br></br>

      <h1 className="text-[#4A2C2A] text-4xl flex flex-col items-center">Recipe Archive</h1> 

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 px-6 py-6">

        {recipeData && recipeData.map((recipe, index) => {

          const recipeRoute =
            recipe.source === "api"
              ? `/search/${recipe.spoonacular_id}`
              : `/recipe/${recipe.recipe_id}`;

          return (

            <li key={index} className="bg-white p-4 rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1">

              <Link to={recipeRoute}>

                {recipe.source === "api" && (

                  <div className="flex items-center gap-2 mb-2">

                    <img
                      src={apiLogo}
                      alt="API Recipe"
                      className="w-6 h-6"
                    />

                    <h2 className="text-xl font-bold text-[#4A2C2A] line-clamp-2">{recipe.title}</h2>

                  </div>

                )}

                {recipe.source === "user" && (

                  <h2 className="text-xl font-bold text-[#4A2C2A] line-clamp-2" >{recipe.title}</h2>

                )}

                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                ></img>

                <p className="text-[#4A2C2A]">
                  <span className="font-semibold">Cook Time: </span>{recipe.cook_time} min
                </p>

                <p className="text-[#4A2C2A]">
                  <span className="font-semibold">Prep Time: </span>
                  {recipe.prep_time ?? "N/A"}
                </p>

                <p className="text-[#4A2C2A]">
                  <span className="font-semibold">Serving Size: </span>{recipe.serving_size}
                </p>

                <p className="text-[#4A2C2A]">
                  <span className="font-semibold">Description: </span>
                  {recipe.description?.replace(/<[^>]*>/g, "")
                    .slice(0, 100)}
                    ...
                </p>


              </Link>

            </li>

          );

        })}

        <li>
          <button
            onClick={() => navigate("/addrecipe")}
            className="w-full h-full min-h-80 rounded-lg border-2 border-dashed border-[#6E8B5B] bg-[#F9F6F1] flex flex-col items-center justify-center transition hover:bg-[#EEF5E8] ver:scale-[1.02]"
          >
            <span className="text-6xl text-[#6E8B5B]">+</span>

            <p className="mt-4 text-lg font-semibold text-[#4A2C2A]">
              Add New Recipe
            </p>

            <p className="text-sm text-gray-600">
              Create your own recipe
            </p>
          </button>
        </li>

      </ul>

    </div>
  )
}

export default Recipes