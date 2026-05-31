import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import '../index.css'
import apiLogo from './assets/images/spoonacular_logo.svg'

function Search() {

  let navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    query: "",
    diet: "",
    cuisine: "",
    maxReadyTime: "",
    includeIngredients: [],
    excludeIngredients: []
  });


  const [isLoading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {

        const fetchRandomRecipes = async () => {
    
            try {

                  setLoading(true);

                const response = await fetch('http://localhost:4000/search/', {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                });
    
                const data = await response.json()
                setRecipes(data.recipes);
                setNoResults(false);

            } catch (error) {
                console.error('Error:', error.message);
            } finally {

                setLoading(false);

              }
        };
        // console.log("in use")

        fetchRandomRecipes();

    }, [token]);

  const handleSearch = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(
        `http://localhost:4000/search/searchquery`,
        {
          method: 'POST',

          credentials: 'include',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(searchQuery)
        }
      );

      const data = await response.json();

      setRecipes(data.results || []);

      if (data.results.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const handleSeachQueryChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value
    });
  };

  const addIncludedIngredient = () => {
    setSearchQuery({
      ...searchQuery,
      includeIngredients: [
        ...searchQuery.includeIngredients,
        ""
      ]
    });
  };

  const removeIncludedIngredient = (index )=> {
    setSearchQuery({
      ...searchQuery,
      includeIngredients:
        searchQuery.includeIngredients.filter(
          (_, i) => i !== index
        )
    });
  };

  const addExcludedIngredient = () => {
    setSearchQuery({
      ...searchQuery,
      excludeIngredients: [
        ...searchQuery.excludeIngredients,
        ""
      ]
    });
  };
  const removeExcludedIngredient = (index )=> {
    setSearchQuery({
      ...searchQuery,
      excludeIngredients:
        searchQuery.excludeIngredients.filter(
          (_, i) => i !== index
        )
    });
  };

  const handleIncludedIngredientChange = (index, value) => {

    const updatedIngredients = [
      ...searchQuery.includeIngredients
    ];

    updatedIngredients[index] = value;

    setSearchQuery({
      ...searchQuery,
      includeIngredients: updatedIngredients
    });
  };

  const handleExcludedIngredientChange = (index, value) => {
    const updatedIngredients = [
      ...searchQuery.excludeIngredients
    ];

    updatedIngredients[index] = value;

    setSearchQuery({
      ...searchQuery,
      excludeIngredients: updatedIngredients
    });
  };

    console.log(recipes)

  return (
    <div>

      <h1>Search Page</h1>

      <form onSubmit={handleSearch}>
        <input 
            type='search' 
            value={searchQuery.query} 
            onChange={(e) => 
              setSearchQuery({
                ...searchQuery,
                query: e.target.value
              })
            } 
          />
        <input 
            type='submit' 
            value='Search'
          />

        <p>Filters: </p>
        <br></br>

        <label htmlFor="diet">Diet: </label>
        <input 
        type="text" 
        name="diet" 
        placeholder="Seach by Diet"
        onChange={handleSeachQueryChange} 
        value={searchQuery.diet} 
        />

        <br></br>

        <label htmlFor="cuisine">Cuisine: </label>
        <input 
        type="text" 
        name="cuisine" 
        placeholder="Seach by Cuisine"
        onChange={handleSeachQueryChange} 
        value={searchQuery.cuisine} 
        />

        <br></br>

        <label htmlFor="maxReadyTime">Max Ready Time: </label>
        <input 
        type="number" 
        name="maxReadyTime" 
        placeholder="Seach by Ready Time"
        onChange={handleSeachQueryChange} 
        value={searchQuery.maxReadyTime} 
        />

        <br></br>

        <p>Include Ingredients: </p>

        {searchQuery.includeIngredients.map((iIngredient, index) => (
          <div key={index}>
            <input 
            name="includeIngredient"
            type="text"
            autoComplete="off"
            placeholder="Ingredient Name"
            value={iIngredient}
            onChange={(e) => 
              handleIncludedIngredientChange(index, e.target.value)
            }
            />

            <button
              type="button"
              onClick={() => removeIncludedIngredient(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <br></br>

        <button type="button" onClick={addIncludedIngredient}>+ Add Ingredient</button>

        <br></br>

        <p>Exclude Ingredients: </p>

        {searchQuery.excludeIngredients.map((eIngredient, index) => (
          <div key={index}>
            <input 
            name="excludeIngredient"
            type="text"
            autoComplete="off"
            placeholder="Ingredient Name"
            value={eIngredient}
            onChange={(e) => 
              handleExcludedIngredientChange(index, e.target.value)
            }
            />

            <button
              type="button"
              onClick={() => removeExcludedIngredient(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <br></br>

        <button type="button" onClick={addExcludedIngredient}>+ Add Ingredient</button>

        <br></br>

      </form>

      {isLoading ? (
        <p> Loading...</p>
      ) : noResults ? (
        <p>No recipes found.</p>
      ) : (

        <ul>

        {recipes && recipes.map((recipe) => {
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
  )
}

export default Search