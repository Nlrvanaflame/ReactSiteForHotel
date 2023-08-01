import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';




const FurniturePage = () => {
  const [furniture, setFurniture] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [selectedId, setSelectedId] = useState('');

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


    const fetchRooms = async () => {
      try {
        console.log('Fetching rooms...');
        const response = await axios.get('http://localhost:4000/rooms/');
        console.log('Fetched rooms:', response.data);
        setRooms(response.data);
      } catch (error) {
        console.log('Error fetching rooms:', error);
        setError(error);
      }
    };
    
    fetchData();
    fetchRooms();
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

    if (selectedId.length===0){
      setRoomIdError("Please select a room")
    }
    else {
      setRoomIdError('')
    }


    // if (!roomId.trim() && name.trim()) {
    //   setRoomIdError('Room ID is required');
    //   valid = false;
    // } else {
    //   setRoomIdError('');
    // }
    

    return valid;
  };


  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);

  };

  // const handleRoomIdChange = (event) => {
  //   const value = event.target.value;
  //   // setRoomId(value);
  //   setSelectedId(value);

  // };

  const handleRoomChange = (event) => {
    const value = event.target.value;
    setSelectedId(value);
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
  
    
    if (validateForm() && selectedId){

      
    try {
     
      await axios.post('http://localhost:4000/furniture/', { name, roomId:selectedId });
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
      <h2>Furniture Page</h2>
      {rooms.length > 0 ? (
        <div>
          <ul>
            {furniture.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Room Name: {item.Room.name}</p>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={handleOpenModal}>Add Furniture</button>
        </div>
      ) : (
        <p>No existing rooms. Please create a room first.</p>
      )}


      {/* Render the Modal component conditionally */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          name={name}
          selectedId={selectedId}
          rooms={rooms}
          roomId={roomId}
          handleNameChange={handleNameChange}
          handleRoomChange={handleRoomChange}
          handleSubmit={handleSubmit}
          nameError={nameError}
          roomIdError={roomIdError}
        />
      )}
    </div>
  );
};


export default FurniturePage;

