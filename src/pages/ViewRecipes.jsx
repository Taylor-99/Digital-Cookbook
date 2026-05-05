import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import '../index.css'

function ViewRecipe() {

  let navigate = useNavigate();

  const token = localStorage.getItem("token");
  const { recipeID } = useParams();

  const [isLoading, setLoading] = useState(true);
  const[recipe, setRecipe] = useState(null);
  // console.log("recipeID: ", recipeID);

  const fetchRecipeDetails = async () => {

    console.log(recipeID)
    try{
      const response = await fetch(`http://localhost:4000/recipe/${recipeID}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      setRecipe(data);
      setLoading(false);

    } catch (error){
      console.error('Error: ', error.message);
    }
  };

  useEffect(() => {
    if(recipeID){
      fetchRecipeDetails();
    }
  }, [recipeID]);

  const handleDeleteRecipe = async () => {
    const confirmed = window.confirm (
      "Are you sure you want to delete this recipe?"
    );

    if(!confirmed) return;

    try{
      const response = await fetch(`http://localhost:4000/recipe/${recipeID}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        navigate("/recipes");
      } else{
        alert("failed to delete recipe.");
      }
    }catch (error) {
      console.error(error);
    }
  }

  if (isLoading) return <p>Loading...</p>
  if (!recipe) return <p>No Recipe data</p>

  console.log(recipe);

  return (
    <div>

      <h1>View Recipe Page</h1>

      <button onClick={() => navigate(-1)}>
        Go Back
      </button>

      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.image}></img>

      <p><span>Description: </span>{recipe.description}</p>
      <p><span>Cook Time: </span> {recipe.cook_time} min</p>
      <p><span>Prep Time: </span> {recipe.prep_time} min</p>
      <p><span>Serving Size: </span> {recipe.serving_size}</p>

      <h3>Ingredients: </h3>

      {/* {console.log(recipe.ingredients)} */}

      <ul>
      {recipe.ingredients && recipe.ingredients.map((ingredient, index) => {

        return(
          <li key={index}>
            <p>{ingredient.quantity} {ingredient.unit} of <span>{ingredient.name}</span></p>
          </li>
        );

      })}
      </ul>

      <br></br>
      <h3>Instructions: </h3>

      <ol>
      {recipe.instructions && recipe.instructions.map((step, index) => {

        return(
          <li key={index}>
            <p>{step.step}</p>
          </li>
        );

      })}
      </ol>

      <button onClick={() => navigate(`/recipe/edit/${recipe.recipe_id}`)}>
        Edit Recipe
      </button>
      <button onClick={handleDeleteRecipe}>
        Delete Recipe
      </button>

    </div>
  )
}

export default ViewRecipe