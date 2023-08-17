import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import Navigation from './Navigation';
import { FormData } from '../Types/Apartment';
import { ModalData } from '../Types/Apartment';
import { useAppContext } from '../Context/AppContext';

const ApartmentPage: React.FC = () => {
  const { apartments, floors, rooms, furnitures, fetchApartmentsAndRooms, loading, error } = useAppContext()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    model: '',
    floorId: '',
    nameError: '',
    modelError: '',
    IdError: '',
    floorsData: [],
  });

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    addingFurnitureToRoom: false,
    adding2: false,
    apartmentId: '',
    roomId: ''
  });

  useEffect(() => {
    if (floors && floors.length > 0) {
      const formattedFloors = floors.map((apartment) => ({
        id: apartment.id.toString(),
        label: apartment.name,
      }));
      setFormData((prevData) => ({
        ...prevData,
        roomsData: formattedFloors,
      }));
    }
  }, [apartments]);


  const change = (key: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleNameChange = change('name');

  const inputs = useMemo(() => {
    if (modalData.adding2) {
      return [
        {
          title: 'Name',
          value: formData.name,
          changeValue: handleNameChange,
          error: formData.nameError,
        },
        {
          title: 'Model',
          value: formData.model,
          changeValue: change('model'),
          error: formData.modelError,
        },
      ];
    }
    return [
      {
        title: 'Name',
        value: formData.name,
        changeValue: handleNameChange,
        error: formData.nameError,
      },
    ];
  }, [formData, handleNameChange]);

  const findFloorName = (floorId: number) => {
    const floor = floors?.find(floor => floor.id === floorId);
    return floor ? floor.name : '';
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/apartments/${id}`);
      fetchApartmentsAndRooms()
    } catch (error) {
      console.log('Error deleting apartment:', error);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/rooms/${id}`);
      window.location.reload();
    } catch (error) {
      console.log('Error deleting room:', error);
    }
  };

  const handleDeleteFurniture = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/furniture/${id}`);
      window.location.reload();
    } catch (error) {
      console.log('Error furniture room:', error);
    }
  };

  const handleAddRoom = (apartmentId: string) => {
    setModalData({
      isOpen: true,
      addingFurnitureToRoom: true,
      adding2: false,
      apartmentId: apartmentId,
      roomId: ""
    });
  };

  const handleAddFurniture = (roomId: string) => {
    setModalData({
      isOpen: true,
      addingFurnitureToRoom: true,
      adding2: true,
      apartmentId: "",
      roomId: roomId
    });
  };

  const validateForm = () => {
    const { name, floorId } = formData;
    let isValid = true;

    if (!name.trim()) {
      setFormData((prevData) => ({ ...prevData, nameError: 'Name is required' }));
      isValid = false;
    } else {
      setFormData((prevData) => ({ ...prevData, nameError: '' }));
    }

    if (!floorId && !modalData.addingFurnitureToRoom) {
      setFormData((prevData) => ({ ...prevData, IdError: 'Please select a floor' }));
      isValid = false;
    } else {
      setFormData((prevData) => ({ ...prevData, IdError: '' }));
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { name, model, floorId } = formData;
    const { apartmentId, roomId } = modalData;

    if (!modalData.addingFurnitureToRoom) {
      if (validateForm()) {
        try {
          await axios.post('http://localhost:4000/apartments/', { name, floorId });
          setModalData({
            isOpen: false,
            addingFurnitureToRoom: false,
            adding2: false,
            apartmentId: '',
            roomId: ''
          });
          setFormData((prevData) => ({ ...prevData, name: '', model: '' }));
          fetchApartmentsAndRooms()
        } catch (error) {
          console.error('Error adding apartment:', error);
        }
      }
    } else if (!modalData.adding2) {
      if (validateForm()) {
        try {
          await axios.post(`http://localhost:4000/apartments/${apartmentId}/rooms`, { name, apartmentId });

          setModalData({
            isOpen: false,
            addingFurnitureToRoom: false,
            adding2: false,
            apartmentId: '',
            roomId: ''
          });
          setFormData((prevData) => ({ ...prevData, name: '', model: '' }));
          fetchApartmentsAndRooms()
        } catch (error) {
          console.error('Error adding room:', error);
        }
      }
    }

    else {
      try {
        console.log('Sending request to add furniture to room with roomId:', roomId);
        await axios.post(`http://localhost:4000/rooms/${roomId}/furniture`, { name, model, roomId });

        setModalData({
          isOpen: false,
          addingFurnitureToRoom: false,
          adding2: false,
          apartmentId: '',
          roomId: '',
        });
        setFormData((prevData) => ({ ...prevData, name: '', model: '' }));
        fetchApartmentsAndRooms()
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
      <h2>Apartment Page</h2>
      {floors && floors.length > 0 ? (
        <div>
          <button onClick={() => setModalData({ addingFurnitureToRoom: false, adding2: false, isOpen: true, apartmentId: "", roomId: "" })}>Add Apartment</button>
          <ul>
            {apartments?.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Floor: {findFloorName(item.floorId)}</p>
                <button onClick={() => handleAddRoom(item.id.toString())}>Add Room</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>

                {item && (
                  <ul>
                    {rooms && rooms
                      .filter(roomItem => roomItem.apartmentId === item.id)
                      .map((roomItem) => (
                        <li key={roomItem.id}>
                          <p>Rooms: {roomItem.name}</p>
                          <button onClick={() => handleAddFurniture(roomItem.id.toString())}>Add Furniture</button>
                          <button onClick={() => handleDeleteRoom(roomItem.id)}>Delete</button>

                          {roomItem && (
                            <ul>
                              {furnitures && furnitures
                                .filter(furnitureItem => furnitureItem.roomId === roomItem.id)
                                .map((furnitureItem) => (
                                  <li key={furnitureItem.id}>
                                    <p>Furniture: {furnitureItem.name}</p>
                                    <button onClick={() => handleDeleteFurniture(furnitureItem.id)}>Delete</button>
                                  </li>
                                ))}
                            </ul>
                          )}
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
        <p>No existing floors. Please create a floor first.</p>
      )}

      {modalData.isOpen && (
        <Modal
          isOpen={modalData.isOpen}
          onClose={() => setModalData({ ...modalData, addingFurnitureToRoom: false, isOpen: false })}
          selectedId={formData.floorId}
          dropdownData={floors || []}
          handleChange={change('floorId')}
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
