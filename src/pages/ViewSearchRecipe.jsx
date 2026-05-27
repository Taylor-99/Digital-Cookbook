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
    const [similarRecipes, setSimilarRecipes] = useState([])

    const [isSavedtoRecipes, setIsSavedtoRecipes] = useState(false);
    const [isSavedtoCollection, setIsSavedtoCollection] = useState(false);
    const [savedRecipeID, setSavedRecipeID] = useState(null);
    const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
    const [savedCollections, setSavedCollections] = useState([]);
    const [collectionData, setCollectionData] = useState([]);

    console.log("Recipe ID: ", recipeID);

    const mockRecipe = {
    id: 13214235,
    title: "Chocolate Pudding",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc",
    summary: "A rich and creamy chocolate pudding dessert.",
    readyInMinutes: 25,
    servings: 4,
    instructions:
        "Combine water, maple syrup, cocoa, cornstarch or corn flour and vanilla together in a saucepan.\nWhisk smooth with a spoon or hand whisker.\nCook over medium heat and stir constantly until pudding is very thick.\nPour into dessert dishes and top with chopped hazelnuts.\nCool and serve.",
    extendedIngredients: [
        {
            amount: 2,
            measure: {
                us: {
                    unitShort: "cups"
                }
            },
            name: "water"
        },
        {
            amount: 3,
            measure: {
                us: {
                    unitShort: "tbsp"
                }
            },
            name: "cocoa powder"
        }
    ]
};

const mockSimilarRecipes = [
    {
        id: 2454325,
        title: "Vanilla Pudding",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
        readyInMinutes: 15,
        servings: 2
    },
    {
        id: 3421341,
        title: "Chocolate Cake",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        readyInMinutes: 45,
        servings: 8
    }
];

    // const fetchRecipeDetails = async () => {

    //     // console.log(recipeID)
    //     try{
    //     const response = await fetch(`http://localhost:4000/search/${recipeID}`, {
    //         credentials: 'include',
    //         headers: {
    //         Authorization: `Bearer ${token}`,
    //         }
    //     });

    //     const data = await response.json();
    //     setRecipeData(data.recipe);
    //     setSimilarRecipes(data.similarRecipes);
    //     setLoading(false);

    //     } catch (error){
    //     console.error('Error: ', error.message);
    //     }
    // };

    // const checkIfSavedtoRecipe = async () => {

    //     try {

    //         const response = await fetch(
    //             `http://localhost:4000/search/${recipeID}/saved`,
    //             {
    //                 credentials: 'include',
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 }
    //             }
    //         );

    //         const data = await response.json();

    //         setIsSavedtoRecipes(data.saved);
    //           setSavedRecipeID(data.recipeID);

    //     } catch (error) {

    //         console.error(error.message);

    //     }

    // };

    // useEffect(() => {

    //     if (recipeID) {
    //         fetchRecipeDetails();
    //         checkIfSavedtoRecipe();
    //     }

    // }, [recipeID]);

    useEffect(() => {

        setRecipeData(mockRecipe);
        setSimilarRecipes(mockSimilarRecipes);
        setIsSavedtoRecipes(true);

        setLoading(false);
        setSavedRecipeID(mockRecipe.id)

        fetchCollections()

    }, [token]);

    console.log("Saved ID: ", savedRecipeID);

    const fetchCollections = async () => {

        try {
            const response = await fetch('http://localhost:4000/collections/', {
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`, 
                }
            });

            const data = await response.json()
            // console.log(data)
            setCollectionData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleCollectionToggle = async (
        collectionId,
        isSaved
    ) => {

        try {

        if (isSaved) {

            console.log(collectionId)
            console.log(recipeID)

            // REMOVE RECIPE
            await fetch(
            `http://localhost:4000/collections/${collectionId}/recipe/${savedRecipeID}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            // update local state
            setSavedCollections((prev) =>
            prev.filter(
                (collection) => collection.collection_id !== collectionId
            )
            );

        } else {

            // SAVE RECIPE
            await fetch(
                `http://localhost:4000/collections/${collectionId}/recipe`,
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                    body: JSON.stringify({
                        recipe_id: savedRecipeID
                    })
                }
            );

            // add locally
            const addedCollection = collectionData.find(
                (collection) =>
                    collection.collection_id === collectionId
            );

            setSavedCollections((prev) => {

                const alreadySaved = prev.some(
                (collection) =>
                    collection.collection_id === collectionId
                );

                if (alreadySaved) {
                return prev;
                }

                return [...prev, addedCollection];
            });

        }

        } catch (err) {

            console.error(err);

        }
    };

    const handleDeleteRecipe = async () => {
        const confirmed = window.confirm (
        "Are you sure you want to delete this recipe?"
        );

        if(!confirmed) return;

        try{
        const response = await fetch(`http://localhost:4000/search/${savedRecipeID}`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            }
        });

        if (response.ok) {
            navigate(`/search/${recipeID}`);
        } else{
            alert("failed to delete recipe.");
        }
        }catch (error) {
        console.error(error);
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

            {isSavedtoRecipes ? (

                <>

                    <button>
                        Saved
                    </button>

                    <button onClick={handleDeleteRecipe}>
                        Remove Recipe
                    </button>

                    <br />
                    <br />

                    <button
                        onClick={() =>
                            setShowCollectionDropdown(
                                !showCollectionDropdown
                            )
                        }
                    >
                        Save To Collection ▼
                    </button>

                    {showCollectionDropdown && (

                        <div className="collection-dropdown">

                            {collectionData.map((collection) => {

                                const isSaved = savedCollections.some(
                                    (savedCollection) =>
                                        Number(savedCollection.collection_id) ===
                                        Number(collection.collection_id)
                                );

                                return (

                                    <button
                                        key={collection.collection_id}
                                        onClick={() =>
                                            handleCollectionToggle(
                                                collection.collection_id,
                                                isSaved
                                            )
                                        }
                                    >

                                        {isSaved ? "✓ " : "+ "}
                                        {collection.collection_name}

                                    </button>

                                );
                            })}

                        </div>

                    )}

                </>

    ) : (

        <button>Save Recipe</button>

    )}

            <img src={recipeData.image} alt={recipeData.title}></img>

            <p><span>Description: </span>{recipeData.summary}</p>
            <p><span>Ready In: </span> {recipeData.readyInMinutes} min</p>

            <h3>Ingredients: </h3>
            <ul>
                {recipeData.extendedIngredients && recipeData.extendedIngredients.map((ingredient, index) => {

                    return(
                    <li key={index}>
                        <p>{ingredient.amount} {ingredient.measure.us.unitShort} of{" "} <span>{ingredient.name}</span></p>
                    </li>
                    );
                })}
            </ul>

            <div>
                <h2>Instructions</h2>

                {recipeData.instructions ? (
                    <ol>
                    {recipeData.instructions
                        .split('\n')
                        .filter(step => step.trim() !== '')
                        .map((step, index) => (
                        <li key={index}>
                            {step}
                        </li>
                        ))}
                    </ol>
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