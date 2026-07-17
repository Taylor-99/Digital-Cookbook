import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../index.css'
import apiLogo from './assets/images/spoonacular_logo.svg'
import Notes from "../components/Notes"

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
    const [savedCollections, setSavedCollections] = useState([]);

    const [showTextbox, setShowTextbox] = useState(false);
    const [notesData, setNotesData] = useState([])
    const [editingNote, setEditingNote] = useState(null);

    // console.log("Recipe ID: ", recipeID);

    const fetchRecipeDetails = async () => {

        // console.log(recipeID)
        try{
            const response = await fetch(`http://localhost:4000/search/${recipeID}`, {
                credentials: 'include',
                headers: {
                Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.json();
            setRecipeData(data.recipe);
            setSimilarRecipes(data.similarRecipes);
            setLoading(false);

        } catch (error){
            console.error('Error: ', error.message);
        }
    };

    const checkIfSavedtoRecipe = async () => {

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

    useEffect(() => {

        if (recipeID) {
            fetchRecipeDetails();
            checkIfSavedtoRecipe();
        }

    }, [recipeID]);

    const fetchCollections = async () => {

        // console.log("Checking collections for recipe:", savedRecipeID);

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

    const checkIfSavedtoCollection = async () => {

        if (!savedRecipeID) return;

        try {

            const response = await fetch(
                `http://localhost:4000/collections/collectionsrecipe/${savedRecipeID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setSavedCollections(data);

        } catch (err) {

            console.error(err);

        }
    };

    const fetchNotes = async () => {

        // console.log(recipeID)
        try{
        const response = await fetch(`http://localhost:4000/recipe/notes/recipe/${savedRecipeID}`, {
            credentials: 'include',
            headers: {
            Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.json();
        setNotesData(data);

        } catch (error){
        console.error('Error: ', error.message);
        }
    };

    useEffect(() => {

        fetchCollections();

    }, []);

    useEffect(() => {

        if (savedRecipeID) {
            checkIfSavedtoCollection();
            fetchNotes();
        }

    }, [savedRecipeID]);

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

    const handleCollectionToggle = async (
        collectionId,
        isSaved
    ) => {

        try {

        if (isSaved) {

            // console.log(collectionId)
            // console.log(recipeID)

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
            const addedCollection = collections.find(
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

    const handleAddNote = async (newNote) => {
      // setCollectionData(prev => [...prev, newCollection]);

    //   console.log("New Note: ", newNote);

      try{
        const response = await fetch(`http://localhost:4000/recipe/create/note/${savedRecipeID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(newNote)
        });

        if (!response.ok) {
          throw new Error("Failed to create note");
        }

        const createdNote = await response.json();

        setNotesData(prev => [...prev, createdNote]);

        // console.log(createdNote);

      } catch (error){
        console.error("Error creating collection: ", error)
      }
    };

    const handleEditNote = async (updatedNote) => {

      try {

        const response = await fetch(
          `http://localhost:4000/recipe/notes/${editingNote.note_id}`,
          {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(updatedNote)
          }
        );

          const updatedNoteResponse = await response.json();

          setNotesData((prev) =>
            prev.map((note) =>
              note.note_id === updatedNoteResponse.note_id
                ? updatedNoteResponse
                : note
            )
          );

          setEditingNote(null);
          // setShowTextbox(false);

        } catch (error) {

            console.error("Error editing note:", error);

        }
    };

    const handleDeleteNote = async (noteID) => {
      const confirmed = window.confirm (
        "Are you sure you want to delete this Note?"
      );

      if(!confirmed) return;

      try{
        const response = await fetch(`http://localhost:4000/recipe/notes/${noteID}`, {
          method: "DELETE",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.ok) {
          setNotesData((prev) =>
            prev.filter(
              (note) => note.note_id !== noteID
            )
          );
        } else{
          alert("failed to delete note.");
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

    // console.log("Recipe Data: ", recipeData);
    // console.log("Similar Recipes: ", similarRecipes);

    return (

        <div>
            
            <h1>ViewSearchRecipe</h1>

            <div className="recipe-header">
                <img
                src={apiLogo}
                alt={recipeData.title}
                className="recipe-thumbnail"
                />

                <h2>{recipeData.title}</h2>
            </div>

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
                                    {collections.map((collection) => {

                                        const isSaved = savedCollections.some(
                                            (savedCollection) => 
                                                Number(savedCollection.collection_id) === 
                                                Number(collection.collection_id)
                                            );

                                            return(

                                                <button
                                                    key={collection.collection_id}
                                                    onClick={() =>
                                                        handleCollectionToggle(collection.collection_id,
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

            <div>

                <ul>

                    {notesData && notesData.map((note, index) => {
                    return (
                        <li key={index}>
                            
                            <p>- {note.content}</p>
                            <p>
                            Created: {new Date(note.created_at).toLocaleDateString()}
                            </p>

                            {note.updated_at &&
                            note.updated_at !== note.created_at && (
                            <p>
                                Updated: {new Date(note.updated_at).toLocaleDateString()}
                            </p>
                            )}
        
                        <button onClick={() => {
                            setEditingNote(note);
                        }}>
                            Edit
                        </button>

                        {editingNote?.note_id === note.note_id && (
                            <Notes
                            onClose={() => {
                                setEditingNote(null);
                            }}
                            onSubmit={handleEditNote}
                            initialData={editingNote}
                            />
                        )}

                        <button onClick={() => handleDeleteNote(note.note_id)}>
                            Delete Note
                        </button>

                        <br></br>

                        </li>

                    );

                    })}

                </ul>

                <button 
                onClick={() => {
                setShowTextbox(true);
                setEditingNote(null);
                }}>
                    + Add Note
                </button>

                {showTextbox && !editingNote && (
                    <Notes
                        onClose={() => setShowTextbox(false)}
                        onSubmit={handleAddNote}
                    />
                )}

            </div>

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