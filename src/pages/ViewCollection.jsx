import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../index.css'

function ViewCollection() {

    let navigate = useNavigate();

    const token = localStorage.getItem("token");
    const { collectionID } = useParams();

    const [isLoading, setLoading] = useState(true);
    const[collection, setCollection] = useState(null);

    const fetchCollectionDetails = async () => {

        // console.log(recipeID)
        try{
            const response = await fetch(`http://localhost:4000/collections/collection/${collectionID}`, {
                credentials: 'include',
                headers: {
                Authorization: `Bearer ${token}`,
                }
        });

        const data = await response.json();
        // console.log(data)
        setCollection(data);
        setLoading(false);

        } catch (error){
            console.error('Error: ', error.message);
        }
    };

  useEffect(() => {
    if(collectionID){
      fetchCollectionDetails();
    }
  }, [collectionID]);

  console.log(collection)
  if (isLoading || !collection) {
    return <p>Loading...</p>;
    }

    return (
        <div>

            <h1>View Collection</h1>

            <button onClick={() => navigate(-1)}>
                Go Back
            </button>

            <h2>{collection.collection_name}</h2>
            <p>{collection.description}</p>

            <ul>

                {collection.recipes && collection.recipes.length > 0 ? (
                    collection.recipes.map((recipe, index) => {

                        return(

                            <li key={index}>

                                <Link to={`/recipe/${recipe.recipe_id}`}>

                                    <h2>{recipe.title}</h2>

                                    <img src={recipe.image} alt={recipe.title} />

                                    <p>{recipe.description}</p>

                                    <p>Prep Time: {recipe.prep_time}</p>

                                    <p>Cook Time: {recipe.cook_time}</p>

                                    <p>Servings: {recipe.serving_size}</p>

                                </Link>

                            </li>

                        );
                    })

                ) : (
                    <p>No recipes added to this collection yet.</p>
                )}

            </ul>

        </div>
    );
}

export default ViewCollection