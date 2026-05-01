import React, { useState } from 'react';
import { useNavigate } from "react-router";
import '../index.css'

function CreateCollection() {

  let navigate = useNavigate();

  return (
    <div>

      <button onClick={() => navigate(-1)}>
        Go Back
      </button>

      <h2>Create New Collection</h2>

    </div>
  )
}

export default CreateCollection