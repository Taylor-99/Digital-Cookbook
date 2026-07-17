import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import '../index.css'
import apiLogo from './assets/images/spoonacular_logo.svg'

function Home() {

  // the global variables used throughout the code
  let navigate = useNavigate();
  //verify the user in the backend

  const token = localStorage.getItem("token");


  //contains the data to show on the home page
  const [recipeData, setRecipeData] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [apiRecipes, setAPIRecipes] = useState([]);
  const [apiError, setApiError] = useState(null);

  const [isLoading, setLoading] = useState(true);

  //This function retrieves the users recipe from the backend
  const fetchRecipes = async () => {
    
    try {

        //calls the backend to get the users recipes
        const response = await fetch('http://localhost:4000/recipe/', {
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            }
        });

        //the recipies that were retrieved from the database
        const data = await response.json();

        // console.log(data)

        //this gets the top 5 recent recipes that the user created not from api
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

  //This function retrieves hte collections that the user created
  const fetchCollections = async () => {

    //calls the backend to get the users collections
    try {
      const response = await fetch('http://localhost:4000/collections/', {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });

      //returns the collections that the user created
      const data = await response.json()

      //sorts the collections for recently created collections and gets the top 5
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

  //gets random api recipes
  const fetchRandomRecipes = async () => {

    //calls the backend to retrieve the randome recipes from the api
    try {

      //this calls the backend to retrieve the api recipes
      const response = await fetch('http://localhost:4000/search', {
          credentials: 'include',
          headers: {
              Authorization: `Bearer ${token}`, 
          }
      });

      //the api recipes are sent to the front
      const data = await response.json();

      // console.log(data)

      //takes the first 5 api recipes
      const randomRecipes = data.slice(0, 5);

      // console.log("random recipes: ", randomRecipes)

      if (!response.ok) {
        throw new Error(data.message);
      };

      // console.log(randomRecipes)
      setAPIRecipes(randomRecipes);

    } catch (error) {
      setApiError(error.message);
    }
  };


  //calls functions that fetches the data (user recipes, users collections, api recipes) for the home page
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

  //used to show loading while the data is being retrieved
  if (isLoading) return <p>Loading...</p>

  return (
    <div>

      <br></br>
      <br></br>

      <h1 className="text-[#4A2C2A] text-4xl flex flex-col items-center">Welcome</h1>

      <br></br>
      <br></br>

      <div className="grid grid-cols-1 gap-4 px-6 py-6">

        {/* redirects to the add recipe page */}
        <h2 className="text-[#4A2C2A] text-2xl font-bold text-center mb-4">Recent Recipes</h2>

        <div className="flex justify-between items-center">

          <Link 
            to="/addrecipe" 
            className="px-4 py-2 rounded-lg bg-[#6E8B5B] text-white hover:bg-[#5E774D]">

            + Add Recipe

          </Link>

          {/* redirects to recipe page to view all users recipes */}
          <Link 
            to="/recipes"
            className="font-medium hover:text-[#D8A75B]"
          >

            View All Recipes →

          </Link>

        </div>

      </div>


      <br></br>

      <div>

        {/* Goes through all the recipes that were retrived from the backend and ordered by most recent and are displayed on the frontend*/}
        <ul>

          {recipeData && recipeData.map((recipe, index) => {

            return (
              <li key={index}>

                {/* links to view the recipe */}
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

      {/* redirects the user to their created collections page */}
      <Link to="/collections">

        View All Collections →

      </Link>

      <br></br>

      <div>

        {/* goes through the collections retrieved from the backend and display them on the frontend */}
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

      {/* redirects the user to the search page */}
      <Link to="/search">
      
        More Recipes →
      
      </Link>

      <br></br>

      <div>

        {/* this shows if there are no recipes to display because of the api :/ */}
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

          // this will run if there are recipes to display 
          <ul>
    
            {/* goes through the results to display them on the frontend */}
            {apiRecipes && apiRecipes.map((recipe) => {
              return (
                <li key={recipe.id}>
    
                  {/* redirects to view the api recipe */}
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
