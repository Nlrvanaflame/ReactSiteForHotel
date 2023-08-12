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


  const handleOpenModal = () => {
    setModalData({
      isOpen: true,
      addingFurnitureToRoom: false
    });
  };

  const handleCloseModal = () => {
    setModalData({
      isOpen: false,
      addingFurnitureToRoom: false
    });
  };


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
        error: formData.nameError
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
    console.log('handleAddFurniture called with roomId:', roomId);
    console.log('xd:', modalData.addingFurnitureToRoom === false)
  };

  // const validateForm = () => {
  //   const { name, model, apartmentId } = formData;
  //   if (!name.trim()) {
  //     setFormData(prevData => ({ ...prevData, nameError: 'Name is required' }));
  //     return false;
  //   }
  //   if (!model.trim()) {
  //     setFormData(prevData => ({ ...prevData, modelError: 'Model is required' }));
  //     return false;
  //   }

  //   if (!apartmentId) {
  //     setFormData(prevData => ({ ...prevData, IdError: 'Please select a room' }));
  //     return false;
  //   }

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     nameError: '',
  //     modelError: '',
  //     IdError: '',
  //   }));
  //   return true;

  // }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, model, apartmentId } = formData;
    const { roomId } = modalData;

    if (!modalData.addingFurnitureToRoom) {
      try {
        await axios.post('http://localhost:4000/rooms/', { name, model, apartmentId });
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
    else {
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
      {modalData.isOpen && (
        <Modal
          isOpen={modalData.isOpen}
          onClose={handleCloseModal}
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