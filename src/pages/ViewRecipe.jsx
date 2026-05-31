import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Notes from "../components/Notes"
import '../index.css'

function ViewRecipe() {

  let navigate = useNavigate();

  const token = localStorage.getItem("token");
  const { recipeID } = useParams();

  const [isLoading, setLoading] = useState(true);
  const[recipe, setRecipe] = useState(null);
  // console.log("recipeID: ", recipeID);
  const [collectionData, setCollectionData] = useState([]);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [savedCollections, setSavedCollections] = useState([]);

  const [showTextbox, setShowTextbox] = useState(false);
  const [notesData, setNotesData] = useState([])
  const [editingNote, setEditingNote] = useState(null);

  const fetchRecipeDetails = async () => {

    // console.log(recipeID)
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

  const fetchNotes = async () => {

    // console.log(recipeID)
    try{
      const response = await fetch(`http://localhost:4000/recipe/notes/recipe/${recipeID}`, {
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
    if(recipeID){
      fetchRecipeDetails();
      fetchNotes()
    }
  }, [recipeID]);

  useEffect(() => {

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
    // console.log("in use")

    fetchCollections();

  }, [token]);

  useEffect(() => {

    const checkIfSaved = async () => {

        try {

            const res = await fetch(
                `http://localhost:4000/collections/collectionsrecipe/${recipeID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            // console.log("is saved: ", data)

              setSavedCollections(data);

        } catch (err) {

            console.error(err);

        }
    };

    if (recipeID) {
        checkIfSaved();
    }

}, [recipeID, token]);

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
            `http://localhost:4000/collections/${collectionId}/recipe/${recipeID}`,
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
                      recipe_id: recipeID
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

  const handleAddNote = async (newNote) => {
      // setCollectionData(prev => [...prev, newCollection]);

      console.log("New Note: ", newNote);

      try{
        const response = await fetch(`http://localhost:4000/recipe/create/note/${recipeID}`, {
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

        console.log(createdNote);

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

  if (isLoading) return <p>Loading...</p>
  if (!recipe) return <p>No Recipe data</p>

  // console.log(recipe);

  return (
    <div>

      <h1>View Recipe Page</h1>

      <button onClick={() => navigate(-1)}>
        Go Back
      </button>

      <h2>{recipe.title}</h2>

      <button
        onClick={() =>
          setShowCollectionDropdown(
            !showCollectionDropdown
          )
        }
      >
        {savedCollections.length > 0
          ? "Saved"
          : "Save To Collection ▼"
        }
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
                  onClick={() => handleCollectionToggle(
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

      <br></br>
      <br></br>

      <img src={recipe.image} alt={recipe.image}></img>

      <p><span>Description: </span>{recipe.description}</p>
      <p><span>Cook Time: </span> {recipe.cook_time} min</p>
      <p><span>Prep Time: </span> {recipe.prep_time} min</p>
      <p><span>Serving Size: </span> {recipe.serving_size}</p>

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