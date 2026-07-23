import { useState, useEffect, useRef } from 'react';
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

  const recipeScrollRef = useRef(null);
  const collectionScrollRef = useRef(null);
  const discoverScrollRef = useRef(null);

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

      // console.log(data)

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
            className="text-[#4A2C2A] font-medium hover:text-[#D8A75B]"
          >

            View All Recipes →

          </Link>

        </div>

      </div>


      <br></br>

      <div>

        {/* Goes through all the recipes that were retrived from the backend and ordered by most recent and are displayed on the frontend*/}

        {recipeData.length === 0 ? (
          <p> No Recipes yet</p>
        ) : (

          <div className="overflow-hidden">

            <div className="flex items-center gap-2">

              {/* Left Arrow */}
              <button
                onClick={() =>
                  recipeScrollRef.current?.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  })
                }
                className="hidden sm:flex xl:hidden items-center justify-center w-10 h-10 rounded-full bg-[#D8A75B]/75 hover:bg-[#C99243]/75"
              >
                ◀
              </button>

              <ul 
                ref={recipeScrollRef}
                className="flex min-w-0 flex-1 gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-2" 
              >

                {recipeData && recipeData.map((recipe, index) => {

                  return (
                    
                    <li key={index} className="flex-none w-64">

                        <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">

                          {/* links to view the recipe */}
                          <Link to={`/recipe/${recipe.recipe_id}`}>
                        
                            <h2 className="text-xl font-bold text-[#4A2C2A] line-clamp-2 min-h-14">{recipe.title}</h2>
            
                            <img 
                              src={recipe.image} 
                              alt={recipe.title} 
                              className="w-full h-40 object-cover rounded-md mb-2"
                            ></img>
            
                            <p className="text-[#4A2C2A]"><span className="font-semibold">⏱ Prep: </span>{recipe.prep_time} min</p>

                            <p className="text-[#4A2C2A]" ><span className="font-semibold">🍳 Cook: </span>{recipe.cook_time} min</p>
            
                            <p className="text-[#4A2C2A]" ><span className="font-semibold" >🍽 Serves: </span>{recipe.serving_size}</p>

                          </Link>

                          <details className="mt-3">

                            <summary className="cursor-pointer font-medium text-[#6E8B5B]">
                                Description
                            </summary>

                            <p className="mt-2 text-sm text-gray-700">
                              {recipe.description
                              ?.replace(/<[^>]*>/g, "")
                              .slice(0, 150)}
                            </p>

                          </details>


                        </div>

                      </li>

                  );

                })}

              </ul>

            </div>
            {/* Right Arrow */}
            <button
              onClick={() =>
                recipeScrollRef.current?.scrollBy({
                  left: 300,
                  behavior: "smooth",
                })
              }
              className="hidden sm:flex xl:hidden items-center justify-center w-10 h-10 rounded-full bg-[#D8A75B]/75 hover:bg-[#C99243]/75"
            >
              ▶
            </button>
          </div>

        )}
      
      </div>

      <br></br>

      <div className="grid grid-cols-1 gap-4 px-6 py-6" >

        <h2 className="text-[#4A2C2A] text-2xl font-bold text-center" >
          Recent Collections
        </h2>


        <div className="flex items-center">

          {/* redirects the user to their created collections page */}
          <Link 
            to="/collections"
            className="text-[#4A2C2A] ml-auto font-medium hover:text-[#D8A75B]"
          >

            View All Collections →

          </Link>

        </div>

      </div>

      <br></br>

      <div>

        {/* goes through the collections retrieved from the backend and display them on the frontend */}
        {collectionData.length === 0 ? (
            <p> No collections yet</p>
        ) : (

          <div className="overflow-hidden">

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  collectionScrollRef.current?.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  })
                }
                className="hidden sm:flex xl:hidden items-center justify-center w-10 h-10 rounded-full bg-[#D8A75B]/75 hover:bg-[#C99243]/75"
              >
                ◀
              </button>

              <ul ref={collectionScrollRef}
              className="flex min-w-0 flex-1 gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-2">

                {collectionData && collectionData.map((collection, index) => {
                  return (
                    <li key={index} className="flex-none w-64">

                      <div className="relative bg-[url('src/pages/assets/images/greenCover.png')] bg-cover bg-center h-auto min-h-64 p-4 shadow-md rounded-l-md w-full transition-all duration-200 hover:shadow-xl hover:-translate-y-1">

                        <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/20 via-transparent to-black/20">
                        </div>

                        <div className="absolute left-0 top-0 h-full w-5 bg-[#6b3f2a] border-r border-[#4A2C2A] shadow-inner"></div>

                        <div className="relative z-10 pl-8 pr-4 pt-4">

                          <Link to={`/collection/${collection.collection_id}`}>

                            <div className=" text-center text-[#4A2C2A] line-clamp-2 min-h-14 mx-6 mt-6 rounded bg-[#F8F3E8]/90 py-2 shadow">

                              <h2 className="text-xl font-bold">{collection.collection_name}</h2>

                              <p>🍽 {collection.recipe_count} Recipes</p>
                            </div>

                        
                          </Link>

                          <div className="mt-5 border-b border-[#D8A75B]"/>

                          <div className="border-b border-[#D8A75B]"></div>

                          <details className="group mt-3">

                            <summary className="list-none cursor-pointer rounded-md bg-[#F8F3E8] px-4 py-2 text-center font-semibold text-[#4A2C2A] shadow-md transition hover:bg-[#EFE6D2]">
                                📖 About this Cookbook
                            </summary>

                            <div className="mt-3 rounded-md bg-[#F8F3E8] p-3 shadow-inner">

                              <p className="text-sm text-[#4A2C2A] leading-relaxed">
                                  {collection.description
                                  ?.replace(/<[^>]*>/g, "")
                                  .slice(0, 150)}
                              </p>

                            </div>

                            <div className="overflow-hidden transition-all duration-300 group-open:mt-4"></div>

                          </details>
                          
                        </div>

                        <div className="absolute right-1 top-1 bottom-1 w-2 bg-[#F8F3E8] rounded-r-sm shadow-inner pointer-events-none">
                          <div className="w-0.5 bg-[#FDFBF6]"></div>
                          <div className="w-0.5 bg-[#F3EBDD]"></div>
                          <div className="w-0.5 bg-[#E8DCC5]"></div>
                        </div>

                      </div>

                    </li>

                  );

                })}

              </ul>
          
              {/* Right Arrow */}
              <button
                onClick={() =>
                  collectionScrollRef.current?.scrollBy({
                    left: 300,
                    behavior: "smooth",
                  })
                }
                className="hidden sm:flex xl:hidden items-center justify-center w-10 h-10 rounded-full bg-[#D8A75B]/75 hover:bg-[#C99243]/75"
              >
                ▶
              </button>
            </div>
          </div>
          
        )}
        
      </div>

      <br></br>

      <div className="grid grid-cols-1 gap-4 px-6 py-6">

        <h2 className="text-[#4A2C2A] text-2xl font-bold text-center">
          Discover Something New
        </h2>

        <div className="flex items-center">

          {/* redirects the user to the search page */}
          <Link 
            to="/search"
            className="text-[#4A2C2A] ml-auto font-medium hover:text-[#D8A75B]"
          >
          
            More Recipes →
          
          </Link>

        </div>

      </div>

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

          <div>

            {/* this will run if there are recipes to display  */}
            <div className="flex items-center gap-2">

              {/* Left Arrow */}
              <button
                onClick={() =>
                  discoverScrollRef.current?.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  })
                }
                className="hidden sm:flex xl:hidden items-center justify-center w-10 h-10 rounded-full bg-[#D8A75B]/75 hover:bg-[#C99243]/75"
              >
                ◀
              </button>

              <ul 
                ref={discoverScrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
              >
        
                {/* goes through the results to display them on the frontend */}
                {apiRecipes && apiRecipes.map((recipe) => {
                  return (
                    <li key={recipe.id} className="flex-none w-64">

                      <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">

                        {/* redirects to view the api recipe */}
                        <Link to={`/search/${recipe.id}`}>
                        
                          <div className="flex items-center gap-2 mb-2">

                            <img
                              src={apiLogo}
                              alt=""
                              className="w-6 h-6"
                            />

                            <h2 className="text-xl font-bold text-[#4A2C2A] line-clamp-2">
                                {recipe.title}
                            </h2>

                          </div>
          
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="w-full h-40 object-cover rounded-md mb-2"
                          ></img>
          
          
                          <p className="text-[#4A2C2A]">
                            <span className="font-semibold">Ready In: </span>
          
                            {recipe.readyInMinutes || "N/A"} min
                          </p>
          
                          <p className="text-[#4A2C2A]">
                            <span className="font-semibold"> Cuisine: </span>
          
                            {recipe.cuisines?.length
                              ? recipe.cuisines.join(", ")
                              : "N/A"
                            }
                          </p>
          
                          <p className="text-[#4A2C2A]">
                            <span className="font-semibold"> Diet: </span>
          
                            {recipe.diets?.length
                            ? recipe.diets.join(", ")
                            : "N/A"
                            }
                          </p>
          
                          <p className="text-[#4A2C2A]">
                            <span className="font-semibold">Serving Size: </span>
          
                            {recipe.servings}
                          </p>

                        </Link>

                        <details className="mt-3">

                          <summary className="cursor-pointer font-medium text-[#6E8B5B]">
                              Description
                          </summary>
                          
                          <p className="mt-2 text-sm text-gray-700">
                              {recipe.summary
                              ?.replace(/<[^>]*>/g, "")
                              .slice(0, 150)}
                            ...
                          </p>

                        </details>
          
                        <br></br>

                      </div>
        
                    </li>
        
                  );
        
                })}
        
              </ul>

              {/* Right Arrow */}
              <button
                onClick={() =>
                  discoverScrollRef.current?.scrollBy({
                    left: 300,
                    behavior: "smooth",
                  })
                }
                className="hidden sm:flex xl:hidden items-center justify-center w-10 h-10 rounded-full bg-[#D8A75B]/75 hover:bg-[#C99243]/75"
              >
                ▶
              </button>

            </div>
            
          </div>

        )}
        
      </div>

      <br></br>

    </div>
  )
}

export default Home
