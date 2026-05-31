import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Notes({ onClose, onSubmit, initialData }) {

    let navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [note, setNote] = useState({});

    useEffect(() => {
        if (initialData) {
            setNote({
                content: initialData.content
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit(note);
        onClose();
    };

    const handleNoteChange = (e) => {
        const { value } = e.target;

        setNote(prev => ({
            ...prev,
            content: value
        }));
    };

  return (
    <div>

        <form onSubmit={handleSubmit}>
            <textarea
                name="note"
                value={note.content}
                onChange={handleNoteChange}
                placeholder='Add Note'
            />
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>

    </div>
  )
}

export default Notes