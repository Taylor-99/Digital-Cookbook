import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import CollectionForm from "../components/CollectionForm"
import '../index.css'

function Collections() {

  let navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [collectionData, setCollectionData] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false)

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
                setCollectionData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error.message);
            }
        };
        // console.log("in use")

        fetchCollections();

    }, [token]);

    const handleAddCollection = async (newCollection) => {
      // setCollectionData(prev => [...prev, newCollection]);

      console.log("New Collection: ", newCollection);

      try{
        const response = await fetch('http://localhost:4000/collections/create', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(newCollection)
        });

        const savedCollection = await response.json();
        // console.log("FROM BACKEND", savedCollection);

        setCollectionData((prev) => [...prev, savedCollection]);

        // console.log("STATE AFTER: ", collectionData);

      } catch (error){
        console.error("Error creating collection: ", error)
      }
    };

    const handleEditCollection = async (updatedCollection) => {

      try {

        const response = await fetch(
          `http://localhost:4000/collections/${editingCollection.collection_id}`,
          {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(updatedCollection)
          }
        );

          const editedCollection = await response.json();

          setCollectionData((prev) =>
            prev.map((collection) =>
              collection.collection_id === editedCollection.collection_id
                ? editedCollection
                : collection
            )
          );

          setEditingCollection(null);
          setShowForm(false);

        } catch (error) {

            console.error("Error editing collection:", error);

        }
    };

    const handleDeleteCollection = async (collectionID) => {
      const confirmed = window.confirm (
        "Are you sure you want to delete this collection?"
      );

      if(!confirmed) return;

      try{
        const response = await fetch(`http://localhost:4000/collections/collection/${collectionID}`, {
          method: "DELETE",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.ok) {
          setCollectionData((prev) =>
            prev.filter(
              (collection) => collection.collection_id !== collectionID
            )
          );
        } else{
          alert("failed to delete recipe.");
        }
      }catch (error) {
        console.error(error);
      }
    };

  if (isLoading) return <p>Loading...</p>
  // console.log(collectionData)

  return (
    <div>

      <h1>Collections Page</h1>

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
                  <button onClick={() => {
                    setEditingCollection(collection);
                  }}>
                    Edit
                  </button>

                  {editingCollection?.collection_id === collection.collection_id && (
                    <CollectionForm
                      onClose={() => {
                        setEditingCollection(null);
                      }}
                      onSubmit={handleEditCollection}
                      initialData={editingCollection}
                    />
                  )}

                  <button onClick={() => handleDeleteCollection(collection.collection_id)}>
                      Delete Collection
                  </button>

                  <br></br>

                </li>

              );

            })}

          </ul>
          
        </div>
      )}

      <div>
        <button 
          onClick={() => {
          setShowForm(true);
          setEditingCollection(null);
          }}>
            + Create Collection
        </button>

        {showForm && !editingCollection && (
          <CollectionForm
            onClose={() => setShowForm(false)}
            onSubmit={handleAddCollection}
          />
)}

      </div>

    </div>
  )
}

export default Collections