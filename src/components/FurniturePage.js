import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';




const FurniturePage = () => {
  const [furniture, setFurniture] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  //Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [nameError, setNameError] = useState('');
  const [roomIdError, setRoomIdError] = useState('');

  

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
    
    fetchData();
  }, []);


  // const toggleModal = () => {
  //   setShowModal(!showModal);
  // };
  // Function to open the modal


  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };


  //Functions for name,id change and submit

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);

  
    if (!value.trim()) {
      setNameError('Name is required.');
    } else {
      setNameError('');
    }
  };

  const handleRoomIdChange = (event) => {
    const value = event.target.value;
    setRoomId(value);

    
    if (!value.trim()) {
      setRoomIdError('Room ID is required.');
    } else {
      setRoomIdError('');
    }
  };

  const handleDelete = async(id)=>{
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


  

    
    if (!name.trim()) {
      setNameError('Name is required.');
      return;
    }

  
    if (!roomId.trim()) {
      setRoomIdError('Room ID is required.');
      return;
    }

      

    try {
     
      await axios.post('http://localhost:4000/furniture/', { name, roomId });
      // Close the modal after successful submission
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error adding furniture:', error);
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
      <h2>Furniture Page</h2>
      <ul>
        {console.log('Furniture:', furniture)}
        {furniture.map(item => (
          <li key={item.id}>
            <p>Name: {item.name}</p>
            <p>Room ID: {item.roomId}</p>
            <button onClick={() => handleDelete(item.id)}>Delete</button>          
          </li>
        ))}
      </ul>

      {/* Add a button to open the modal */}
      <button onClick={handleOpenModal}>Add Furniture</button>

      {/* Render the Modal component conditionally */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          name={name}
          roomId={roomId}
          handleNameChange={handleNameChange}
          handleRoomIdChange={handleRoomIdChange}
          handleSubmit={handleSubmit}
          nameError={nameError}
          roomIdError={roomIdError}
        />
      )}
    </div>
  );
};


export default FurniturePage;

