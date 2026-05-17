import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import CollectionForm from "../components/CollectionForm"
import '../index.css'

function Collections() {

  // let navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [collectionData, setCollectionData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {

        const fetchCollections = async () => {
    
            try {
                const response = await fetch('http://localhost:4000/collection/', {
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
        const response = await fetch('http://localhost:4000/collection/create', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(newCollection)
        });

        const savedCollection = await response.json();
        console.log("FROM BACKEND", savedCollection);

        setCollectionData((prev) => [...prev, savedCollection]);

        console.log("STATE AFTER: ", collectionData);

      } catch (error){
        console.error("Error creating collection: ", error)
      }
    };



  if (isLoading) return <p>Loading...</p>
  console.log(collectionData)

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

                  <Link to={`collection/${collection.collection_id}`}>
                    <h2>{collection.collection_name}</h2>
                    
                    <p>Description: {collection.description}</p>
                  </Link>

                  <br></br>

                </li>

              );

            })}

          </ul>
          
        </div>
      )}

      <div>
        <button onClick={() => setShowForm(true)}>
          + Create Collection
        </button>

        {showForm && (
          <CollectionForm
            onClose={() => setShowForm(false)}
            onAdd={handleAddCollection}
          />
        )}

      </div>

    </div>
  )
}

export default Collections