import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';
import Navigation from './Navigation';

const ApartmentPage = () => {
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  //Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [floorId, setFloorId] = useState('');
  const [nameError, setNameError] = useState('');
  const [IdError, setIdError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching apartment data...');
        const response = await axios.get('http://localhost:4000/apartments/');
        console.log('Fetched apartment data:', response.data);
        setApartments(response.data);
      } catch (error) {
        console.log('Error fetching apartment data:', error);
        setError(error);
      }
      setLoading(false);
    };

    const fetchFields = async () => {
      try {
        console.log('Fetching apartments...');
        const response = await axios.get('http://localhost:4000/floors/');
        console.log('Fetched apartments:', response.data);
        setFields(response.data);
      } catch (error) {
        console.log('Error fetching apartments:', error);
        setError(error);
      }
    };

    fetchData();
    fetchFields();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Functions for name, id change and submit
  const validateForm = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }

    if (selectedId.length === 0) {
      setIdError('Please select a field');
    } else {
      setIdError('');
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

  const inputs = [
    {
      title: "Name",
      value: name,
      changeValue: handleNameChange,
      error: nameError
    }
  ]

  const handleDelete = async (id) => {
    try {
      // Send the delete request to the backend
      await axios.delete(`http://localhost:4000/apartments/${id}`);

      // Update the apartments state to remove the deleted apartment
      setApartments((prevApartments) => prevApartments.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting apartment:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm() && selectedId) {
      try {
        await axios.post('http://localhost:4000/apartments/', { name, floorId: selectedId });
        // Close the modal after successful submission
        setShowModal(false);
        window.location.reload();
      } catch (error) {
        console.error('Error adding apartment:', error);
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
      <h2>Apartment Page</h2>
      {fields.length > 0 ? (
        <div>
          <button onClick={handleOpenModal}>Add Apartment</button>
          <ul>
            {apartments.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Floor: {item.Floor.name}</p>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>

        </div>
      ) : (
        <p>No existing floors. Please create a floor first.</p>
      )}

      {/* Render the Modal component conditionally */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          name={name}
          selectedId={selectedId}
          fields={fields}
          floorId={floorId}
          handleNameChange={handleNameChange}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          nameError={nameError}
          IdError={IdError}
          inputs={inputs}
        />
      )}
    </div>
  );
};

export default ApartmentPage;
