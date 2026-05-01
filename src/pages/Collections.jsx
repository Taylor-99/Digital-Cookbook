import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router";
import '../index.css'

function Collections() {

  let navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [collectionData, setCollectionData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {

        const fetchCollections = async () => {
    
            try {
                const response = await fetch('http://localhost:4000/collection/', {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
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

  if (isLoading) return <p>Loading...</p>
  // if (collectionData.length === 0){
  //   return <p>No Collections to show</p>
  // }

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
        <button onClick={() => navigate('/createcollection')}>
            + Create Collection
          </button>
      </div>

    </div>
  )
}

export default Collections