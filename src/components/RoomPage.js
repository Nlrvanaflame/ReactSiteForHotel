import React, { useEffect, useMemo, useState } from 'react';
import axios from "axios";
import Modal from './Modal';
import Navigation from './Navigation';




const RoomPage = () => {
  const [room, setRoom] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fields, setfields] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');

  //Modal State
  const [addingFurnitureToRoom, setAddingFurnitureToRoom] = useState(false);
  const [model, setModel] = useState('')

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [apartmentId, setApartmentId] = useState('');
  const [nameError, setNameError] = useState('');
  const [IdError, setIdError] = useState('');



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching room data...');
        const response = await axios.get('http://localhost:4000/rooms/');
        console.log('Fetched room data:', response.data);
        setRoom(response.data);
      } catch (error) {
        console.log('Error fetching room data:', error);
        setError(error);
      }
      setLoading(false);
    };


    const fetchfields = async () => {
      try {
        console.log('Fetching apartments...');
        const response = await axios.get('http://localhost:4000/apartments/');
        console.log('Fetched apartments:', response.data);
        setfields(response.data);
      } catch (error) {
        console.log('Error fetching apartments:', error);
        setError(error);
      }
    };

    fetchData();
    fetchfields();
  }, []);


  const handleOpenModal = (Id, addingFurniture = false) => {
    setShowModal(true);
    setAddingFurnitureToRoom(addingFurniture);
    setApartmentId(Id);
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
      setIdError("Please select an apartment")
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

  const inputs = useMemo(() => {
    if (selectedRoomId) return [
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
    return [
      {
        title: "Name",
        value: name,
        changeValue: handleNameChange,
        error: nameError
      }

    ]

  }, [selectedId, handleNameChange, handleModel, model, name, nameError])

  // selectedId


  const handleDelete = async (id) => {
    try {
      // Send the delete request to the backend
      await axios.delete(`http://localhost:4000/rooms/${id}`);

      // Update the furniture state to remove the deleted furniture
      setRoom((prevRooms) => prevRooms.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting rooms:', error);
    }
  }

  const handleAddFurniture = async (roomId) => {
    handleOpenModal(roomId, true);
    setSelectedRoomId(roomId);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (addingFurnitureToRoom) {
      if (validateForm()) {
        try {
          console.log("Selected ID:", selectedRoomId);
          console.log("Name:", name);
          console.log("Model:", model);
          await axios.post(`http://localhost:4000/rooms/${selectedRoomId}/furniture`, { name, model, roomId: selectedRoomId });

          setShowModal(false);
          window.location.reload();
        } catch (error) {
          console.error('Error adding furniture:', error);
        }
      }
    } else {
      // Adding a new room
      if (validateForm() && selectedId) {
        try {

          await axios.post('http://localhost:4000/rooms/', { name, apartmentId: selectedId });
          setShowModal(false);
          // window.location.reload();
          window.location.reload();
        } catch (error) {
          console.error('Error adding rooms:', error);
        }
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
      <h2>Room Page</h2>
      {fields.length > 0 ? (
        <div>
          <button onClick={handleOpenModal}>Add Room</button>
          <ul>
            {room.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Apartment: {item.Apartment.name}</p>

                {item.Furniture && item.Furniture.length > 0 && (
                  <ul>
                    {item.Furniture.map((furnitureItem) => (
                      <li key={furnitureItem.id}>
                        <p>Furniture: {furnitureItem.name}</p>
                      </li>
                    ))}
                  </ul>

                )}
                <button onClick={() => handleAddFurniture(item.id)}>Add Furniture</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>

        </div>
      ) : (
        <p>No existing apartments. Please create an apartment first.</p>
      )}


      {/* Render the Modal component conditionally */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          name={name}
          selectedId={selectedId}
          fields={fields}
          apartmentId={apartmentId}
          handleNameChange={handleNameChange}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          nameError={nameError}
          IdError={IdError}
          addingFurnitureToRoom={addingFurnitureToRoom}
          inputs={inputs}
        />
      )}
    </div>
  );
};

export default RoomPage