import React, { useEffect, useMemo, useState } from 'react';
import axios from "axios";
import Modal from './Modal';
import Navigation from './Navigation';
import Room from '../Types/Room'
import Furniture from '../Types/Furniture';
import { FormData } from '../Types/Furniture';
import { ModalData } from '../Types/Furniture';




const FurniturePage: React.FC = () => {
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    model: '',
    roomId: '',
    nameError: '',
    modelError: '',
    IdError: '',
    roomsData: [],
  });

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    addingFurnitureToRoom: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [furnitureResponse, roomsResponse] = await Promise.all([
          axios.get<Furniture[]>('http://localhost:4000/furniture/'),
          axios.get<Room[]>('http://localhost:4000/rooms/'),
        ]);

        setFurniture(furnitureResponse.data);

        const roomsData = roomsResponse.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          roomsData,
        }));
      } catch (error) {
        setError(error as Error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const change = (key: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [key]: value,
    });
  };


  const handleChange = change("roomId");
  const handleModel = change('model');
  const handleNameChange = change('name');

  const inputs = useMemo(() => {
    return [
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
        error: formData.modelError,
      },
    ];
  }, [formData, handleNameChange, handleModel]);

  const validateForm = () => {
    const { name, model, roomId } = formData;
    let isValid = true;

    if (!name.trim()) {
      setFormData((prevData) => ({ ...prevData, nameError: 'Name is required' }));
      isValid = false;
    } else {
      setFormData((prevData) => ({ ...prevData, nameError: '' }));
    }

    if (!model.trim()) {
      setFormData((prevData) => ({ ...prevData, modelError: 'Model is required' }));
      isValid = false;
    } else {
      setFormData((prevData) => ({ ...prevData, modelError: '' }));
    }

    if (!roomId) {
      setFormData((prevData) => ({ ...prevData, IdError: 'Please select a room' }));
      isValid = false;
    } else {
      setFormData((prevData) => ({ ...prevData, IdError: '' }));
    }

    return isValid;
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/furniture/${id}`);
      setFurniture((prevFurniture) => prevFurniture.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting furniture:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { name, model, roomId } = formData;

    if (validateForm()) {
      try {
        await axios.post('http://localhost:4000/furniture/', { name, model, roomId });
        setModalData((prevModalData) => ({ ...prevModalData, isOpen: false }));
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
      <Navigation />
      <h2>Furniture Page</h2>
      {formData.roomsData.length > 0 ? (
        <div>
          <button onClick={() => setModalData((prevModalData) => ({ ...prevModalData, isOpen: true }))}>
            Add Furniture
          </button>
          <ul>
            {furniture.map((item) => (
              <li key={item.id}>
                <p>Furniture: {item.name}</p>
                <p>Model: {item.model}</p>
                <p>Room: {item.Room.name}</p>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
                <h1>------------------------------------------</h1>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No existing furniture. Please add furniture.</p>
      )}

      {modalData.isOpen && (
        <Modal
          isOpen={modalData.isOpen}
          onClose={() => setModalData((prevModalData) => ({ ...prevModalData, isOpen: false }))}
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
