import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import '../index.css'
import apiLogo from './assets/images/spoonacular_logo.svg'

function Home() {

  let navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [recipeData, setRecipeData] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [apiRecipes, setAPIRecipes] = useState([]);
  const [apiError, setApiError] = useState(null);

  const [isLoading, setLoading] = useState(true);

  

  const fetchRecipes = async () => {

    // console.log("in fetch")
    
    try {

        const response = await fetch('http://localhost:4000/recipe/', {
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            }
        });

        const data = await response.json();

        console.log(data)

        const recentRecipes = data
          .filter(recipe => recipe.source === "user" || null)
          .sort(
            (a, b) =>
              new Date(b.created_at) - new Date(a.created_at)
          )
          .slice(0, 5);

        setRecipeData(recentRecipes);

    } catch (error) {

        console.error('Error:', error.message);

    }finally{

      setLoading(false);

    }
  };

  const fetchCollections = async () => {

    try {
      const response = await fetch('http://localhost:4000/collections/', {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });

      const data = await response.json()

      const recentCollections = data
        .sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        )
        .slice(0, 5);

      setCollectionData(recentCollections);

    } catch (error) {
        console.error('Error:', error.message);
    }
  };

  const fetchRandomRecipes = async () => {

    try {

      const response = await fetch('http://localhost:4000/search', {
          credentials: 'include',
          headers: {
              Authorization: `Bearer ${token}`, 
          }
      });

      const data = await response.json();

      const randomRecipes = data.recipes.slice(0, 5);

      if (!response.ok) {
        throw new Error(data.message);
      };

      console.log(randomRecipes)
      setAPIRecipes(randomRecipes);

    } catch (error) {
      setApiError(error.message);
    }
  };


  useEffect(() => {

    const fetchHomeData = async () => {
      try {
        await Promise.all([
          fetchRecipes(),
          fetchCollections(),
          fetchRandomRecipes()
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();

  }, [token]);

  if (isLoading) return <p>Loading...</p>

  return (
    <div>

      <h1>Welcome Back</h1>

      <Link to="/addrecipe">

        Add Recipe

      </Link>

      <h2>Recent Recipes</h2>

      <Link to="/recipes">

        View All Recipes →

      </Link>

      <br></br>

      <div>

        <ul>

          {recipeData && recipeData.map((recipe, index) => {

            return (
              <li key={index}>

                <Link to={`/recipe/${recipe.recipe_id}`}>
              
                  <h2>{recipe.title}</h2>
  
                  <img src={recipe.image} alt={recipe.title}></img>
  
                  <p><span>Description: </span>{recipe.description}</p>
  
                  <p><span>Cook Time: </span>{recipe.cook_time} min</p>
  
                  <p><span>Prep Time: </span>{recipe.prep_time} min</p>
  
                  <p><span>Serving Size: </span>{recipe.serving_size}</p>

                </Link>

                <br></br>

              </li>

            );

          })}

        </ul>
      
      </div>

      <br></br>

      <h2>Recent Collections</h2>

      <Link to="/collections">

        View All Collections →

      </Link>

      <br></br>

      <div>

        {collectionData.length === 0 ? (
            <p> No collections yet</p>
          ) : (
            <div>

              <ul>

                {collectionData && collectionData.map((collection, index) => {
                  return (
                    <li key={index}>

                      <Link to={`/collection/${collection.collection_id}`}>
                        <h2>{collection.collection_name}</h2>
                    
                        <p>Description: {collection.description}</p>
                      </Link>

                    </li>

                  );

                })}

              </ul>
          
            </div>
          )}
        
      </div>

      <br></br>

      <h2>Discover Something New</h2>

      <Link to="/search">
      
        More Recipes →
      
      </Link>

      <br></br>

      <div>

        {apiError ? (
          <div>
            <p>
              Discover Something New is temporarily unavailable.
            </p>

            <p>
              The recipe service has reached its daily request limit.
              Please try again tomorrow.
            </p>
          </div>
        ) : (

          <ul>
    
            {apiRecipes && apiRecipes.map((recipe) => {
              return (
                <li key={recipe.id}>
    
                  <Link to={`/search/${recipe.id}`}>
    
                    <img
                      src={apiLogo}
                      alt="API Recipe"
                      className="api-icon"
                    />
                  
                    <h2>{recipe.title}</h2>
    
                    <img src={recipe.image} alt={recipe.title}></img>
    
                    <p>
                      <span>Description: </span>
    
                      {recipe.summary
                        ?.replace(/<[^>]*>/g, "")
                        .slice(0, 150)}
                      ...
                    </p>
    
                    <p>
                      <span>Ready In: </span>
    
                      {recipe.readyInMinutes || "N/A"} min
                    </p>
    
                    <p>
                      <span> Cuisine: </span>
    
                      {recipe.cuisines?.length
                        ? recipe.cuisines.join(", ")
                        : "N/A"
                      }
                    </p>
    
                    <p>
                      <span> Diet: </span>
    
                      {recipe.diets?.length
                      ? recipe.diets.join(", ")
                      : "N/A"
                      }
                    </p>
    
                    <p>
                      <span>Serving Size: </span>
    
                      {recipe.servings}
                    </p>
    
                  </Link>
    
                  <br></br>
    
                </li>
    
              );
    
            })}
    
          </ul>

        )}
        
      </div>

      <br></br>

    </div>
  )
}

export default Home
