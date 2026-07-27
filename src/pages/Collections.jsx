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

      <br></br>
      <br></br>

      <h1 className="text-[#4A2C2A] text-4xl flex flex-col items-center">Collection Shelf</h1>

      {collectionData.length === 0 ? (

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 px-6 py-6">

          <p> No collections yet</p>

          <div>
            <button 
              onClick={() => {
                setShowForm(true);
                setEditingCollection(null);
              }}
              className="w-full h-full min-h-80 rounded-lg border-2 border-dashed border-[#6E8B5B] bg-[#F9F6F1] flex flex-col items-center justify-center transition hover:bg-[#EEF5E8] ver:scale-[1.02]"
            >
              <span className="text-6xl text-[#6E8B5B]">+</span>

              <p className="mt-4 text-lg font-semibold text-[#4A2C2A]">
                Create Collection
              </p>

              <p className="text-sm text-gray-600">
                Create a Collection for your recipes
              </p>

            </button>

            {showForm && !editingCollection && (
              <CollectionForm
                onClose={() => setShowForm(false)}
                onSubmit={handleAddCollection}
              />
            )}

          </div>
        </div>

      ) : (
        <div>

          <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 px-6 py-6">

            {collectionData && collectionData.map((collection, index) => {

              return (

                <li key={index} className="flex-none w-64">

                  <div  className="relative bg-[url('src/pages/assets/images/greenCover.png')] bg-cover bg-center h-auto min-h-64 p-4 shadow-md rounded-l-md w-full transition-all duration-200 hover:shadow-xl hover:-translate-y-1">

                    <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/20 via-transparent to-black/20"></div>

                    <div className="absolute left-0 top-0 h-full w-5 bg-[#6b3f2a] border-r border-[#4A2C2A] shadow-inner"></div>

                    <div className="relative z-10 pl-8 pr-4 pt-4">

                      <Link to={`/collection/${collection.collection_id}`}>

                        <div className=" text-center text-[#4A2C2A] line-clamp-2 min-h-14 mx-6 mt-6 rounded bg-[#F8F3E8]/90 py-2 shadow">

                          <h2 className="text-xl font-bold">{collection.collection_name}</h2>
                          
                          <p>🍽 {collection.recipe_count} Recipes</p>

                        </div>

                      </Link>

                      <div className="mt-5 border-b border-[#D8A75B]"/>

                      <div className="border-b border-[#D8A75B]"></div>

                      <details className="group mt-3">

                        <summary className="list-none cursor-pointer rounded-md bg-[#F8F3E8] px-4 py-2 text-center font-semibold text-[#4A2C2A] shadow-md transition hover:bg-[#EFE6D2]">
                            📖 About this Cookbook
                        </summary>

                        <div className="mt-3 rounded-md bg-[#F8F3E8] p-3 shadow-inner">

                          <p className="text-sm text-[#4A2C2A] leading-relaxed">
                              {collection.description
                              ?.replace(/<[^>]*>/g, "")
                              .slice(0, 150)}
                          </p>

                        </div>

                        <div className="overflow-hidden transition-all duration-300 group-open:mt-4"></div>

                      </details>
                        
                      </div>

                      <div className="absolute right-1 top-1 bottom-1 w-2 bg-[#F8F3E8] rounded-r-sm shadow-inner pointer-events-none">
                        <div className="w-0.5 bg-[#FDFBF6]"></div>
                        <div className="w-0.5 bg-[#F3EBDD]"></div>
                        <div className="w-0.5 bg-[#E8DCC5]"></div>
                      </div>

                  </div>

                  <div className="flex justify-between items-center pt-2">

                    <button 
                      onClick={() => {
                        setEditingCollection(collection);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#6E8B5B] text-white hover:bg-[#5E774D]"
                    >
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

                    <button 
                    onClick={() => 
                      handleDeleteCollection(collection.collection_id)
                    }
                    className="px-4 py-2 rounded-lg bg-[#A44A3F] text-white hover:bg-[#8C3E35]"
                    >
                        Delete Collection
                    </button>

                  </div>

                  <br></br>

                </li>

              );

            })}

            <div>
              <button 
                onClick={() => {
                  setShowForm(true);
                  setEditingCollection(null);
                }}
                className="w-full h-full min-h-80 rounded-lg border-2 border-dashed border-[#6E8B5B] bg-[#F9F6F1] flex flex-col items-center justify-center transition hover:bg-[#EEF5E8] ver:scale-[1.02]"
              >
                <span className="text-6xl text-[#6E8B5B]">+</span>

                <p className="mt-4 text-lg font-semibold text-[#4A2C2A]">
                  Create Collection
                </p>

                <p className="text-sm text-gray-600">
                  Create a Collection for your recipes
                </p>

              </button>

              {showForm && !editingCollection && (
                <CollectionForm
                  onClose={() => setShowForm(false)}
                  onSubmit={handleAddCollection}
                />
              )}

            </div>

          </ul>
          
        </div>
      )}

    </div>
  )
}

export default Collections