import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CollectionForm({ onClose, onAdd }) {

    let navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [collectionForm, setCollectionForm] = useState({
        collection_name: "",
        description: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        onAdd(collectionForm);
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