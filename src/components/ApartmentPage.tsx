import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import Navigation from './Navigation';
import Apartment from '../Types/Apartment'
import Floor from '../Types/Floor';

interface FormData {
  name: string;
  floorId: string;
  nameError: string;
  IdError: string;
  floorsData: Floor[];
}

interface ModalData {
  isOpen: boolean;
  addingFurnitureToRoom: boolean;
  apartmentId: string;
}

const ApartmentPage: React.FC = () => {
  const [apartment, setApartments] = useState<Apartment[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    floorId: '',
    nameError: '',
    IdError: '',
    floorsData: [],
  });

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    addingFurnitureToRoom: false,
    apartmentId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [floorsResponse, apartmentResponse] = await Promise.all([
          axios.get<Floor[]>('http://localhost:4000/floors/'),
          axios.get<Apartment[]>('http://localhost:4000/apartments/'),
        ]);

        setApartments(apartmentResponse.data);

        const floorsData = floorsResponse.data;
        setFormData((prevData) => ({
          ...prevData,
          floorsData,
        }));
      } catch (error) {
        setError(error as Error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const change = (key: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleChange = change('floorId');
  const handleNameChange = change('name');

  const inputs = useMemo(() => {
    return [
      {
        title: 'Name',
        value: formData.name,
        changeValue: handleNameChange,
        error: formData.nameError,
      },
    ];
  }, [formData, handleNameChange]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/apartments/${id}`);
      setApartments((prevApartments) => prevApartments.filter((item) => item.id !== id));
    } catch (error) {
      console.log('Error deleting apartment:', error);
    }
  };

  const handleAddRoom = (apartmentId: string) => {
    setModalData({
      isOpen: true,
      addingFurnitureToRoom: true,
      apartmentId: apartmentId,
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

    const { name, floorId } = formData;
    const { apartmentId } = modalData;

    if (!modalData.addingFurnitureToRoom) {
      if (validateForm()) {
        try {
          await axios.post('http://localhost:4000/apartments/', { name, floorId });
          setModalData({
            isOpen: false,
            addingFurnitureToRoom: false,
            apartmentId: '',
          });
          window.location.reload();
        } catch (error) {
          console.error('Error adding apartment:', error);
        }
      }
    } else {
      if (validateForm()) {
        try {
          await axios.post(`http://localhost:4000/apartments/${apartmentId}/rooms`, { name, apartmentId });

          setModalData({
            isOpen: false,
            addingFurnitureToRoom: false,
            apartmentId: '',
          });
          window.location.reload();
        } catch (error) {
          console.error('Error adding room:', error);
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
      <h2>Apartment Page</h2>
      {formData.floorsData.length > 0 ? (
        <div>
          <button onClick={() => setModalData({ addingFurnitureToRoom: false, isOpen: true, apartmentId: "" })}>Add Apartment</button>
          <ul>
            {apartment.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Floor: {item.Floor.name}</p>
                <button onClick={() => handleAddRoom(item.id.toString())}>Add Room</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>

                {item.Rooms && item.Rooms.length > 0 && (
                  <ul>
                    {item.Rooms.map((roomItem) => (
                      <li key={roomItem.id}>
                        <p>Rooms: {roomItem.name}</p>
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
