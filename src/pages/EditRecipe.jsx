import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import '../index.css'

function EditRecipe() {

  let navigate = useNavigate();

  const token = localStorage.getItem("token");
  const { recipeID } = useParams();

  const [error, setError] = useState('');

  const [updateRecipeData, setUpdateRecipeData] = useState({
      title: "",
      description: "",
      image: "",
      cook_time: "",
      prep_time: "",
      serving_size: "",
      source: "user"
    });
  
    const [updateIngredientsData, setUpdateIngredientsData] = useState(
      [
          {
        name: "",
        quantity: "",
        unit: "",
        }
      ]
    );
  
    const [updateInstructionsData, setUpdateInstructionsData] = useState(
      [
        {
          step: "",
        }
      ]
    );

    const fetchRecipe = async () => {
    try{
      const response = await fetch(`http://localhost:4000/recipe/${recipeID}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      // console.log(data)
      setUpdateRecipeData({
        title: data.title,
        description: data.description,
        image: data. image,
        cook_time: data.cook_time,
        prep_time: data.prep_time,
        serving_size: data.serving_size,
      });
      setUpdateIngredientsData(data.ingredients);
      setUpdateInstructionsData(data.instructions);

    } catch (error){
      console.error('Error: ', error.message);
    }
  };

  useEffect(() => {

    if(recipeID){
      fetchRecipe();
    };

  }, [recipeID]);

  const handleRecipeUpdate = async () => {

    try{
      const updatedRecipe = {
        ...updateRecipeData,
        ingredients: updateIngredientsData,
        instructions: updateInstructionsData,
      };
  
      const response = await fetch(`http://localhost:4000/recipe/${recipeID}`, {
        method: "PUT",
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedRecipe),
      });

      await response.json();

        if (response.ok) {
          // Redirect or perform an action on successful login
          navigate('/')
        };
    }catch (err) {
      setError('Network error: ' + err.message);
      console.error(err);
    };
  };

  const addIngredient = () => {
    setUpdateIngredientsData([...updateIngredientsData, {name: "", amount: "", unit: ""}]);
  };
  const removeIngredient = (index )=> {
    setUpdateIngredientsData(updateIngredientsData.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    setUpdateInstructionsData([...updateInstructionsData, {step: ""}]);
  };

  const removeInstruction = (index) => {
    setUpdateInstructionsData(updateInstructionsData.filter((_, i) => i !== index));
  };

  const handleRecipeChange = (e) => {
    setUpdateRecipeData({
      ...updateRecipeData,
      [e.target.name]: e.target.value
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...updateIngredientsData];
    updated[index][field] = value;
    setUpdateIngredientsData(updated);
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...updateInstructionsData];
    updated[index].step = value;
    setUpdateInstructionsData(updated);
  }

  return (
    <div>

      <h1>Edit Recipe Page</h1>

      <section>

        {error && <p>{error}</p>}

            <form
              encType = 'multipart/formdata'
              onSubmit={(e) => {
                e.preventDefault();
                setError('');
                handleRecipeUpdate()
              }}
            >

                <label htmlFor="title">Title: </label>
                <input 
                type="text" 
                name="title" 
                placeholder="Enter Recipe Title:"
                onChange={handleRecipeChange} 
                value={updateRecipeData.title} 
                />

                <br></br>

                <label htmlFor="description">Recipe Description: </label>
                <input 
                type="text" 
                name="description" 
                placeholder="Enter Recipe Description:" 
                onChange={handleRecipeChange} 
                value={updateRecipeData.description} 
                />

                <br></br>

                <label htmlFor="image">Recipe Image: </label>
                <input 
                type="text" 
                name="image" 
                placeholder="Enter Recipe image:" 
                onChange={handleRecipeChange} 
                value={updateRecipeData.image} 
                />

                <br></br>

                <label htmlFor="cook_time">Recipe Cook Time (In Minutes): </label>
                <input 
                type="number" 
                name="cook_time" 
                placeholder="Enter Recipe Cook Time:" 
                onChange={handleRecipeChange} 
                value={updateRecipeData.cook_time} 
                />

                <br></br>

                <label htmlFor="prep_time">Recipe Prep Time (In Minutes): </label>
                <input 
                type="number" 
                name="prep_time" 
                placeholder="Enter Recipe Prep Time:" 
                onChange={handleRecipeChange} 
                value={updateRecipeData.prep_time} 
                />

                <br></br>

                <label htmlFor="serving_size">Recipe Serving Size: </label>
                <input 
                type="number" 
                name="serving_size" 
                placeholder="Enter Recipe Serving Size:" 
                onChange={handleRecipeChange} 
                value={updateRecipeData.serving_size} 
                />

                <br></br>

                <p>Recipe Ingredients: </p>

                {updateIngredientsData.map((ingredient, index) => (
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
                  </div>
                ))}
                <br></br>
                <button type="button" onClick={addIngredient}>+ Add Ingredient</button>

                <br></br>
                
                <p>Recipe Instructions: </p>

                {updateInstructionsData.map((instruction, index) => (
                  <div key={index}>
                    <textarea 
                      placeholder={`Step ${index + 1}`}
                      value={instruction.step}
                      onChange={(e) =>
                        handleInstructionChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}

                <br></br>

                <button type="button" onClick={addInstruction}>+ Add Step</button>

                <br></br>
                <br></br>

                <input type="submit" 
                value="Edit Recipe"/>
                <br></br>
            </form>
        </section>

    </div>
  )
}

export default EditRecipe