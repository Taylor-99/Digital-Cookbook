import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../index.css'

function ViewSearchRecipe() {

    let navigate = useNavigate();

    const token = localStorage.getItem("token");
    const { recipeID } = useParams();

    const [isLoading, setLoading] = useState(true);
    const[recipeData, setRecipeData] = useState(null);
    const [similarRecipes, setSimilarRecipes] = useState([]);

    const [isSaved, setIsSaved] = useState(false);
    const [savedRecipeID, setSavedRecipeID] = useState(null);

    const [collections, setCollections] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    console.log("Recipe ID: ", recipeID);

    const fetchRecipeDetails = async () => {

        console.log(recipeID)
        try{
            // const response = await fetch(`http://localhost:4000/search/${recipeID}`, {
            //     credentials: 'include',
            //     headers: {
            //     Authorization: `Bearer ${token}`,
            //     }
            // });

            const data = await response.json();
            setRecipeData(data.recipe);
            setSimilarRecipes(data.similarRecipes);
            setLoading(false);

        } catch (error){
            console.error('Error: ', error.message);
        }
    };

    const checkIfSaved = async () => {

        try {

            const response = await fetch(
                `http://localhost:4000/search/${recipeID}/saved`,
                {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            const data = await response.json();

            setIsSaved(data.saved);
            setSavedRecipeID(data.recipeID);

        } catch (error) {

            console.error(error);

        }

    };

    const fetchCollections = async () => {
        try {
            const response = await fetch("http://localhost:4000/collections", {
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setCollections(data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    useEffect(() => {

        if (recipeID) {
            fetchRecipeDetails();
            checkIfSaved();
            fetchCollections();
        }

    }, [recipeID]);

    const handleSaveRecipe = async () => {

        try {

            const response = await fetch(
                "http://localhost:4000/search/save",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({

                        title: recipeData.title,
                        image: recipeData.image,
                        cook_time: recipeData.readyInMinutes,
                        prep_time: null,
                        serving_size: recipeData.servings,
                        description: recipeData.summary
                            ?.replace(/<[^>]*>/g, ""),
                        spoonacular_id: recipeData.id

                    })
                }
            );

            const data = await response.json();

            setIsSaved(true);

            // this is your DB recipe ID
            setSavedRecipeID(data.recipeid);

        } catch (error) {

            console.error(error);

        }

    };

    const handleDeleteRecipe = async () => {
        const confirmed = window.confirm (
        "Are you sure you want to delete this recipe?"
        );

        if(!confirmed) return;

        try{
            const response = await fetch(`http://localhost:4000/recipe/${savedRecipeID}`, {
                method: "DELETE",
                credentials: 'include',
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {

                setIsSaved(false);

                setSavedRecipeID(null);

            } else {

                alert("failed to delete recipe.");

            }
        }catch (error) {
            console.error(error);
        }
    };

    const handleAddToCollection = async (collectionId) => {
        try {
            await fetch(
                `http://localhost:4000/collections/${collectionId}/recipe`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        recipe_id: savedRecipeID,
                    }),
                }
            );

            setShowDropdown(false);

        } catch (err) {
            console.error(err);
        }
    };

    // Loading state
    if (isLoading) {
        return <p>Loading...</p>;
    };

    // Safety check
    if (!recipeData) {
        return <p>No recipe found.</p>;
    };

    console.log("Recipe Data: ", recipeData);
    console.log("Similar Recipes: ", similarRecipes);

    return (

        <div>
            
            <h1>ViewSearchRecipe</h1>

            <h2>{recipeData.title}</h2>

            {isSaved ? (

                <>
                    <button onClick={handleDeleteRecipe}>
                        Remove Recipe
                    </button>

                    {isSaved && savedRecipeID && (
                        <div>
                            <button onClick={() => setShowDropdown(prev => !prev)}>
                                Add to Collection ▼
                            </button>

                            {showDropdown && (
                                <div className="dropdown">
                                    {collections.map((collection) => (
                                        <button
                                            key={collection.collection_id}
                                            onClick={() =>
                                                handleAddToCollection(collection.collection_id)
                                            }
                                        >
                                            {collection.collection_name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>

            ) : (

                <button onClick={handleSaveRecipe}>
                    Save Recipe
                </button>

            )}

            <img src={recipeData.image} alt={recipeData.title}></img>

            <p>
                <span>Description: </span>

                {recipeData.summary
                ?.replace(/<[^>]*>/g, "")
                }
            </p>
            <p><span>Ready In: </span> {recipeData.readyInMinutes} min</p>

            <h3>Ingredients: </h3>
            <ul>
                {recipeData.extendedIngredients && recipeData.extendedIngredients.map((ingredient, index) => {

                    return(
                    <li key={index}>
                        <p>
                            {ingredient.amount}{" "}
                            {ingredient.measures?.us?.unitShort || ""} of{" "}
                            <span>{ingredient.name}</span>
                        </p>
                    </li>
                    );
                })}
            </ul>

            <div>
                <h2>Instructions</h2>

                {recipeData.instructions ? (

                    <div
                        dangerouslySetInnerHTML={{
                            __html: recipeData.instructions
                        }}
                    />

                ) : (

                    <p>No instructions available.</p>

                )}
            </div>

            <div>

                <h2>Recipes similar to {recipeData.title}</h2>
                <ul>

                    {similarRecipes && similarRecipes.map((recipe) => {
                    return (
                        <li key={recipe.id}>

                        <Link to={`/search/${recipe.id}`}>
                        
                            <h2>{recipe.title}</h2>

                            <img src={recipe.image} alt={recipe.title}></img>

                            <p>
                            <span>Ready In: </span>

                            {recipe.readyInMinutes || "N/A"} min
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
            </div>

        </div>
        
    )
}

export default ViewSearchRecipe