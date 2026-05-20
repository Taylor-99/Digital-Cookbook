import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../index.css'

function AddRecipe() {

  let navigate = useNavigate();

  const [error, setError] = useState('');
  const token = localStorage.getItem("token");

  const [recipeData, setRecipeData] = useState({
    title: "",
    description: "",
    image: "",
    cook_time: "",
    prep_time: "",
    serving_size: "",
    source: "user"
  });

  const [ingredientsData, setIngredientsData] = useState(
    [
        {
      name: "",
      quantity: "",
      unit: "",
      }
    ]
  );

  const [instructionsData, setInstructionsData] = useState(
    [
      {
        step: "",
      }
    ]
  );

  const handleCreateRecipe = async () => {

    const recipe = {
      ...recipeData,
      ingredients: ingredientsData,
      instructions: instructionsData,
    };
    console.log(recipe);

    try {
      const response = await fetch('http://localhost:4000/recipe/create', {
        method: 'POST',
        credentials: "include",
        headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipe),

      });

      await response.json();

            if (response.ok) {
                // Redirect or perform an action on successful login
                navigate('/')
            }

    }catch (err) {
      setError('Network error: ' + err.message);
      console.error(err);
    }
  };

  const addIngredient = () => {
    setIngredientsData([...ingredientsData, {name: "", amount: "", unit: ""}]);
  };
  const removeIngredient = (index )=> {
    setIngredientsData(ingredientsData.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    setInstructionsData([...instructionsData, {step: ""}]);
  };

  const removeInstruction = (index) => {
    setInstructionsData(instructionsData.filter((_, i) => i !== index));
  };

  const handleRecipeChange = (e) => {
    setRecipeData({
      ...recipeData,
      [e.target.name]: e.target.value
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredientsData];
    updated[index][field] = value;
    setIngredientsData(updated);
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructionsData];
    updated[index].step = value;
    setInstructionsData(updated);
  }

  return (
    <div>

      <button onClick={() => navigate(-1)}>
        Go Back
      </button>

      <h2>Add New Recipe</h2>

      <section>

        {error && <p>{error}</p>}

            <form
              encType = 'multipart/formdata'
              onSubmit={(e) => {
                e.preventDefault();
                setError('');
                handleCreateRecipe()
              }}
            >

                <label htmlFor="title">Title: </label>
                <input 
                type="text" 
                name="title" 
                placeholder="Enter Recipe Title:"
                onChange={handleRecipeChange} 
                value={recipeData.title} 
                />

                <br></br>

                <label htmlFor="description">Recipe Description: </label>
                <input 
                type="text" 
                name="description" 
                placeholder="Enter Recipe Description:" 
                onChange={handleRecipeChange} 
                value={recipeData.description} 
                />

                <br></br>

                <label htmlFor="image">Recipe Image: </label>
                <input 
                type="text" 
                name="image" 
                placeholder="Enter Recipe image:" 
                onChange={handleRecipeChange} 
                value={recipeData.image} 
                />

                <br></br>

                <label htmlFor="cook_time">Recipe Cook Time (In Minutes): </label>
                <input 
                type="number" 
                name="cook_time" 
                placeholder="Enter Recipe Cook Time:" 
                onChange={handleRecipeChange} 
                value={recipeData.cook_time} 
                />

                <br></br>

                <label htmlFor="prep_time">Recipe Prep Time (In Minutes): </label>
                <input 
                type="number" 
                name="prep_time" 
                placeholder="Enter Recipe Prep Time:" 
                onChange={handleRecipeChange} 
                value={recipeData.prep_time} 
                />

                <br></br>

                <label htmlFor="serving_size">Recipe Serving Size: </label>
                <input 
                type="number" 
                name="serving_size" 
                placeholder="Enter Recipe Serving Size:" 
                onChange={handleRecipeChange} 
                value={recipeData.serving_size} 
                />

                <br></br>

                <p>Recipe Ingredients: </p>

                {ingredientsData.map((ingredient, index) => (
                  <div key={index}>
                    <input 
                    name="name"
                    type="text"
                    autoComplete="off"
                    placeholder="Ingredient Name"
                    value={ingredient.name}
                    onChange={(e) => 
                      handleIngredientChange(index, "name", e.target.value)
                    }
                    />
                    <input 
                    name="quantity"
                    type="number"
                    autoComplete="off"
                    placeholder="Ingredient quantity"
                    value={ingredient.quantity}
                    onChange={(e) => 
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                    />
                    <input 
                    name="unit"
                    type="text"
                    autoComplete="off"
                    placeholder="Ingredient Amount Unit"
                    value={ingredient.unit}
                    onChange={(e) => 
                      handleIngredientChange(index, "unit", e.target.value)
                    }
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <br></br>
                <button type="button" onClick={addIngredient}>+ Add Ingredient</button>

                <br></br>
                
                <p>Recipe Instructions: </p>

                {instructionsData.map((instruction, index) => (
                  <div key={index}>
                    <textarea 
                      placeholder={`Step ${index + 1}`}
                      value={instruction.step}
                      onChange={(e) =>
                        handleInstructionChange(index, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <br></br>

                <button type="button" onClick={addInstruction}>+ Add Step</button>

                <br></br>
                <br></br>

                <input type="submit" 
                value="Submit"/>
                <br></br>
            </form>
        </section>

    </div>
  )
}

export default AddRecipe