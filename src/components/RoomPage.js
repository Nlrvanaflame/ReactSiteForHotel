import React, { useEffect, useMemo, useState } from 'react';
import axios from "axios";
import Modal from './Modal';
import Navigation from './Navigation';


const RoomPage = () => {
  const [room, setRoom] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    apartmentId: '',
    nameError: '',
    IdError: '',
    apartmentsData: []

  });

  const [modalData, setModalData] = useState({
    isOpen: false,
    addingFurnitureToRoom: false,
    roomId: ''
  });


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomsResponse, apartmentResponse] = await Promise.all([
          axios.get('http://localhost:4000/rooms/'),
          axios.get('http://localhost:4000/apartments/')
        ]);

        setRoom(roomsResponse.data);

        const apartmentsData = apartmentResponse.data

        setFormData((prevData) => ({
          ...prevData,
          apartmentsData
        }))


      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);


  const change = (key) => (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleChange = change("apartmentId")

  const handleModel = change("model")

  const handleNameChange = change("name")

  const inputs = useMemo(() => {
    if (modalData.addingFurnitureToRoom) return [
      {
        title: "Name",
        value: formData.name,
        changeValue: handleNameChange,
        error: formData.nameError
      },
      {
        title: "Model",
        value: formData.model,
        changeValue: handleModel,
        error: formData.modelError
      }

    ]
    return [
      {
        title: "Name",
        value: formData.name,
        changeValue: handleNameChange,
        error: formData.nameError
      }

    ]

  }, [formData, handleNameChange, handleModel, modalData.addingFurnitureToRoom])


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/rooms/${id}`);
      setRoom((prevRooms) => prevRooms.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting rooms:', error);
    }
  }

  const handleAddFurniture = (roomId) => {
    setModalData({
      isOpen: true,
      addingFurnitureToRoom: true,
      roomId: roomId
    });
  };

  const validateForm = () => {
    const { name, model, apartmentId } = formData;
    let isValid = true;

    if (!name.trim()) {
      setFormData(prevData => ({ ...prevData, nameError: 'Name is required' }));
      isValid = false;
    } else {
      setFormData(prevData => ({ ...prevData, nameError: '' }));
    }

    if (!model.trim() && modalData.addingFurnitureToRoom) {
      setFormData(prevData => ({ ...prevData, modelError: 'Model is required' }));
      isValid = false;
    } else {
      setFormData(prevData => ({ ...prevData, modelError: '' }));
    }

    if (!apartmentId && !modalData.addingFurnitureToRoom) {
      setFormData(prevData => ({ ...prevData, IdError: 'Please select an apartment' }));
      isValid = false;
    } else {
      setFormData(prevData => ({ ...prevData, IdError: '' }));
    }

    return isValid;
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, model, apartmentId } = formData;
    const { roomId } = modalData;

    if (!modalData.addingFurnitureToRoom) {
      if (validateForm()) {
        try {
          await axios.post('http://localhost:4000/rooms/', { name, apartmentId });
          setModalData({
            isOpen: false,
            addingFurnitureToRoom: false,
            roomId: ''
          });
          window.location.reload();
        } catch (error) {
          console.error('Error adding furniture:', error);
        }
      }
    }
    else {
      if (validateForm()) {
        try {
          console.log('Sending request to add furniture to room with roomId:', roomId);
          await axios.post(`http://localhost:4000/rooms/${roomId}/furniture`, { name, model, roomId });

          setModalData({
            isOpen: false,
            addingFurnitureToRoom: false,
            roomId: ''
          });
          window.location.reload();
        } catch (error) {
          console.error('Error adding furniture:', error);
        }
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
      <h2>Room Page</h2>
      {formData.apartmentsData.length > 0 ? (
        <div>
          <button onClick={() => setModalData({ addingFurnitureToRoom: false, isOpen: true }
          )}>Add Room</button>
          <ul>
            {room.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Apartment: {item.Apartment.name}</p>
                <button onClick={() => handleAddFurniture(item.id)}>Add Furniture</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>


                {item.Furniture && item.Furniture.length > 0 && (
                  <ul>
                    {item.Furniture.map((furnitureItem) => (
                      <li key={furnitureItem.id}>
                        <p>Furniture: {furnitureItem.name}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <h1>------------------------------------------</h1>
              </li>
            ))}
          </ul>

        </div>
      ) : (
        <p>No existing apartments. Please create an apartment first.</p>
      )}

      {modalData.isOpen && (
        <Modal
          isOpen={modalData.isOpen}
          onClose={() => setModalData({ addingFurnitureToRoom: false, isOpen: false })}
          selectedId={formData.apartmentId}
          dropdownData={formData.apartmentsData}
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

export default RoomPage