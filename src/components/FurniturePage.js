import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';
import Navigation from './Navigation';




const FurniturePage = () => {
  const [furniture, setFurniture] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fields, setfields] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  //Modal State
  const [model, setModel] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [nameError, setNameError] = useState('');
  const [IdError, setIdError] = useState('');



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching furniture data...');
        const response = await axios.get('http://localhost:4000/furniture/');
        console.log('Fetched furniture data:', response.data);
        setFurniture(response.data);
      } catch (error) {
        console.log('Error fetching furniture data:', error);
        setError(error);
      }
      setLoading(false);
    };


    const fetchfields = async () => {
      try {
        console.log('Fetching rooms...');
        const response = await axios.get('http://localhost:4000/rooms/');
        console.log('Fetched rooms:', response.data);
        setfields(response.data);
      } catch (error) {
        console.log('Error fetching rooms:', error);
        setError(error);
      }
    };

    fetchData();
    fetchfields();
  }, []);


  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };


  //Functions for name,id change and submit




  const validateForm = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }

    if (selectedId.length === 0) {
      setIdError("Please select a room")
    }
    else {
      setIdError('')
    }
    return valid;
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);

  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedId(value);
  };

  const handleModel = (event) => {
    const value = event.target.value;
    setModel(value);
  };

  const inputs = [
    {
      title: "Name",
      value: name,
      changeValue: handleNameChange,
      error: nameError
    },
    {
      title: "Model",
      value: model,
      changeValue: handleModel,
      error: nameError
    }
  ]





  const handleDelete = async (id) => {
    try {
      // Send the delete request to the backend
      await axios.delete(`http://localhost:4000/furniture/${id}`);

      // Update the furniture state to remove the deleted furniture
      setFurniture((prevFurniture) => prevFurniture.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting furniture:', error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();


    if (validateForm() && selectedId) {


      try {

        await axios.post('http://localhost:4000/furniture/', { name, model, roomId: selectedId });
        // Close the modal after successful submission
        setShowModal(false);
        window.location.reload();
      } catch (error) {
        console.error('Error adding furniture:', error);
      }
    }
  };





  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Navigation />
      <h2>Furniture Page</h2>
      {fields.length > 0 ? (
        <div>
          <button onClick={handleOpenModal}>Add Furniture</button>
          <ul>
            {furniture.map((item) => (
              <li key={item.id}>
                <p>Furniture: {item.name}</p>
                <p>Model: {item.model}</p>
                <p>Room: {item.Room.name}</p>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>

        </div>
      ) : (
        <p>No existing fields. Please create a room first.</p>
      )}


      {/* Render the Modal component conditionally */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          name={name}
          selectedId={selectedId}
          fields={fields}
          roomId={roomId}
          handleNameChange={handleNameChange}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          // handleModel={handleModel}
          nameError={nameError}
          IdError={IdError}
          inputs={inputs}
        />
      )}
    </div>
  );
};


export default FurniturePage;

