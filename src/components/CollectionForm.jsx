import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CollectionForm({ onClose, onSubmit, initialData }) {

    let navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [collectionForm, setCollectionForm] = useState({
        collection_name: initialData?.collection_name || "",
        description: initialData?.description || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit(collectionForm);
        onClose();
    };

    const handleCollectionChange = (e) => {
        setCollectionForm({
            ...collectionForm,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <input 
                    name="collection_name"
                    value={collectionForm.collection_name}
                    onChange={handleCollectionChange}
                    placeholder="Collection Name"
                />
                <textarea
                    name="description"
                    value={collectionForm.description}
                    onChange={handleCollectionChange}
                    placeholder='Add Collection Description'
                />
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>

        </div>
    );

}

export default CollectionForm