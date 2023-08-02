import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';

const FloorPage = () => {
  const [floors, setFloors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [nameError, setNameError] = useState('');
  const [IdError, setIdError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching floor data...');
        const response = await axios.get('http://localhost:4000/floors/');
        console.log('Fetched floor data:', response.data);
        setFloors(response.data);
      } catch (error) {
        console.log('Error fetching floor data:', error);
        setError(error);
      }
      setLoading(false);
    };

    const fetchFields = async () => {
      try {
        console.log('Fetching hotels...');
        const response = await axios.get('http://localhost:4000/hotels/');
        console.log('Fetched hotels:', response.data);
        setFields(response.data);
      } catch (error) {
        console.log('Error fetching hotels:', error);
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
      setIdError('Please select a hotel');
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

  const handleDelete = async (id) => {
    try {
      // Send the delete request to the backend
      await axios.delete(`http://localhost:4000/floors/${id}`);

      // Update the floors state to remove the deleted floor
      setFloors((prevFloors) => prevFloors.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting floor:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm() && selectedId) {
      try {
        await axios.post('http://localhost:4000/floors/', { name, hotelId: selectedId });
        // Close the modal after successful submission
        setShowModal(false);
        window.location.reload();
      } catch (error) {
        console.error('Error adding floor:', error);
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
      <h2>Floor Page</h2>
      {fields.length > 0 ? (
        <div>
          <ul>
            {floors.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Hotel: {item.Hotel.name}</p>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={handleOpenModal}>Add Floor</button>
        </div>
      ) : (
        <p>No existing hotels. Please create a hotel first.</p>
      )}

      {/* Render the Modal component conditionally */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          name={name}
          selectedId={selectedId}
          fields={fields}
          hotelId={hotelId}
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

export default FloorPage;
