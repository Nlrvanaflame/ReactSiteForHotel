import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';
import Navigation from './Navigation';



const FurniturePage = () => {
  const [furniture, setFurniture] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    roomId: '',
    nameError: '',
    IdError: '',
    roomsData: []

  });

  const [modalData, setModalData] = useState({
    isOpen: false,
    addingFurnitureToRoom: false,

  });



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [furnitureResponse, roomsResponse] = await Promise.all([
          axios.get('http://localhost:4000/furniture/'),
          axios.get('http://localhost:4000/rooms/')
        ]);

        setFurniture(furnitureResponse.data);

        const roomsData = roomsResponse.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          roomsData
        }));


      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);


  const handleOpenModal = () => {
    setModalData({
      isOpen: true,
    });
  };

  const handleCloseModal = () => {
    setModalData({
      isOpen: false,
      addingFurnitureToRoom: false
    });
  };




  const handleNameChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      name: value,
    });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      roomId: value,
    });
  };

  const handleModel = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      model: value,
    });
  };


  const inputs = [
    {
      title: "Name",
      value: formData.name,
      changeValue: handleNameChange,
      error: formData.nameError,
    },
    {
      title: "Model",
      value: formData.model,
      changeValue: handleModel,
      error: formData.nameError,
    },
  ];






  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/furniture/${id}`);
      setFurniture(prevFurniture => prevFurniture.filter(item => item.id !== id));
    } catch (error) {
      console.log('Error deleting furniture:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, model, roomId } = formData;
    if (!name.trim()) {
      setFormData(prevData => ({ ...prevData, nameError: 'Name is required' }));
      return;
    }

    if (!roomId) {
      setFormData(prevData => ({ ...prevData, IdError: 'Please select a room' }));
      return;
    }

    try {
      await axios.post('http://localhost:4000/furniture/', { name, model, roomId });
      setModalData(false);
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
      <Navigation />
      <h2>Furniture Page</h2>
      {formData.roomsData.length > 0 ? (
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
        <p>No existing furniture. Please add furniture.</p>
      )}

      {/* Render the Modal component conditionally */}
      {modalData.isOpen && (
        <Modal
          isOpen={modalData.isOpen}
          onClose={handleCloseModal}
          selectedId={formData.roomId}
          dropdownData={formData.roomsData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          IdError={formData.IdError}
          addingFurnitureToRoom={modalData.addingFurnitureToRoom}
          inputs={inputs}
        />
      )}
    </div>
  );
};


export default FurniturePage;

