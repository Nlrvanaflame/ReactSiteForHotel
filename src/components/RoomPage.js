import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';




const RoomPage = () => {
    const [room, setRoom] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fields, setfields] = useState([]);
    const [selectedId, setSelectedId] = useState('');

    //Modal State
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

  const handleDelete = async(id)=>{
    try {
      // Send the delete request to the backend
      await axios.delete(`http://localhost:4000/rooms/${id}`);

      // Update the furniture state to remove the deleted furniture
      setRoom((prevRooms) => prevRooms.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting rooms:', error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    
    if (validateForm() && selectedId){

      
    try {
     
      await axios.post('http://localhost:4000/rooms/', { name, apartmentId:selectedId });
      // Close the modal after successful submission
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error adding rooms:', error);
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
      <h2>Room Page</h2>
      {fields.length > 0 ? (
        <div>
          <ul>
            {room.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Apartment Name: {item.Apartment.name}</p>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={handleOpenModal}>Add Room</button>
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
        />
      )}
    </div>
  );
};

export default RoomPage