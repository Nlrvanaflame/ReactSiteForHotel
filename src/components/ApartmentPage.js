import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';
import Navigation from './Navigation';

const ApartmentPage = () => {
  const [apartment, setApartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);



  const [formData, setFormData] = useState({
    name: '',
    floorId: '',
    nameError: '',
    IdError: '',
    floorsData: []

  });

  const [modalData, setModalData] = useState({
    isOpen: false,
    addingFurnitureToRoom: false,
    apartmentId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        const [floorsResponse, apartmentResponse] = await Promise.all([
          axios.get('http://localhost:4000/floors/'),
          axios.get('http://localhost:4000/apartments/')
        ]);

        setApartments(apartmentResponse.data);

        const floorsData = floorsResponse.data
        setFormData((prevData) => ({
          ...prevData,
          floorsData
        }))

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
      apartmentId: value,
    });
  };

  const inputs = [
    {
      title: "Name",
      value: formData.name,
      changeValue: handleNameChange,
      error: FormData.nameError
    }
  ]

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/apartments/${id}`);
      setApartments((prevApartments) => prevApartments.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting apartment:', error);
    }
  };

  const handleAddRoom = (apartmentId) => {
    setModalData({
      isOpen: true,
      addingFurnitureToRoom: true,
      apartmentId: apartmentId
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, floorId } = formData;
    const { apartmentId } = modalData;

    if (formData.addingFurnitureToRoom === false) {
      try {
        await axios.post('http://localhost:4000/apartments/', { name, floorId });
        setModalData(false);
        window.location.reload();
      } catch (error) {
        console.error('Error adding furniture:', error);
      }
    }
    else {
      try {
        await axios.post(`http://localhost:4000/apartments/${apartmentId}/rooms`, { name, apartmentId });
        // Close the modal after successful submission
        setModalData(false);
        window.location.reload();
      } catch (error) {
        console.error('Error adding furniture:', error);
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Navigation />
      <h2>Apartment Page</h2>
      {formData.floorsData.length > 0 ? (
        <div>
          <button onClick={handleOpenModal}>Add Apartment</button>
          <ul>
            {apartment.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Floor: {item.Floor.name}</p>
                <button onClick={() => handleAddRoom(item.id)}>Add Furniture</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>

        </div>
      ) : (
        <p>No existing floors. Please create a floor first.</p>
      )}

      {/* Render the Modal component conditionally */}
      {modalData.isOpen && (
        <Modal
          isOpen={modalData.isModal}
          onClose={handleCloseModal}
          selectedId={formData.floorId}
          dropdownData={formData.floorsData}
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

export default ApartmentPage;
