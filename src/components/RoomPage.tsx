import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Modal from './Modal'
import DeleteModal from './ModalDelete'
import Navigation from './Navigation'
import { FormData } from '../Types/Room'
import { ModalData } from '../Types/Room'
import { useAppContext } from '../Context/AppContext'

const RoomPage: React.FC = () => {
  const { apartments, rooms, furnitureMap, fetchApartmentsAndRooms, loading, error } =
    useAppContext()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    model: '',
    apartmentId: '',
    nameError: '',
    modelError: '',
    IdError: '',
    apartmentsData: []
  })

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    addingFurnitureToRoom: false,
    roomId: '',
    deleteModalOpen: false,
    itemToDelete: null,
    type: null
  })

  useEffect(() => {
    if (apartments && apartments.length > 0) {
      const formattedApartments = apartments.map((apartment) => ({
        id: apartment.id.toString(),
        label: apartment.name
      }))
      setFormData((prevData) => ({
        ...prevData,
        apartmentsData: formattedApartments
      }))
    }
  }, [apartments])

  const change =
    (key: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value
      setFormData({
        ...formData,
        [key]: value
      })
    }
  const handleNameChange = change('name')

  const inputs = useMemo(() => {
    if (modalData.addingFurnitureToRoom) {
      return [
        {
          title: 'Name',
          value: formData.name,
          changeValue: handleNameChange,
          error: formData.nameError
        },
        {
          title: 'Model',
          value: formData.model,
          changeValue: change('model'),
          error: formData.modelError
        }
      ]
    }
    return [
      {
        title: 'Name',
        value: formData.name,
        changeValue: handleNameChange,
        error: formData.nameError
      }
    ]
  }, [formData, handleNameChange, modalData.addingFurnitureToRoom])

  const findApartmentName = (apartmentId: number) => {
    const apartment = apartments?.find((apartment) => apartment.id === apartmentId)
    return apartment ? apartment.name : ''
  }

  const handleDeleteOpen = (type: 'apartment' | 'room' | 'furniture', id: number) => {
    setModalData((prevModalData) => ({
      ...prevModalData,
      deleteModalOpen: true,
      itemToDelete: id,
      type: type
    }))
  }

  const handleDeleteConfirm = async () => {
    if (modalData.itemToDelete !== null) {
      try {
        if (modalData.type === 'room') {
          await axios.delete(`http://localhost:4000/rooms/${modalData.itemToDelete}`)
        } else if (modalData.type === 'furniture') {
          await axios.delete(`http://localhost:4000/furniture/${modalData.itemToDelete}`)
        }
        fetchApartmentsAndRooms()
      } catch (error) {
        console.log(`Error deleting ${modalData.type}:`, error)
      }
    }
    setModalData((prevModalData) => ({ ...prevModalData, deleteModalOpen: false }))
  }

  const handleAddFurniture = (roomId: string) => {
    setModalData({
      ...modalData,
      isOpen: true,
      addingFurnitureToRoom: true,
      roomId: roomId
    })
  }

  const validateForm = () => {
    const { name, model, apartmentId } = formData
    let isValid = true

    if (!name.trim()) {
      setFormData((prevData) => ({ ...prevData, nameError: 'Name is required' }))
      isValid = false
    } else {
      setFormData((prevData) => ({ ...prevData, nameError: '' }))
    }

    if (!model.trim() && modalData.addingFurnitureToRoom) {
      setFormData((prevData) => ({ ...prevData, modelError: 'Model is required' }))
      isValid = false
    } else {
      setFormData((prevData) => ({ ...prevData, modelError: '' }))
    }

    if (!apartmentId && !modalData.addingFurnitureToRoom) {
      setFormData((prevData) => ({ ...prevData, IdError: 'Please select an apartment' }))
      isValid = false
    } else {
      setFormData((prevData) => ({ ...prevData, IdError: '' }))
    }

    return isValid
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const { name, model, apartmentId } = formData
    const { roomId } = modalData

    if (!modalData.addingFurnitureToRoom) {
      if (validateForm()) {
        try {
          await axios.post('http://localhost:4000/rooms/', { name, apartmentId })
          setModalData({
            ...modalData,
            isOpen: false,
            addingFurnitureToRoom: false,
            roomId: ''
          })
          setFormData((prevData) => ({ ...prevData, name: '' }))
          fetchApartmentsAndRooms()
        } catch (error) {
          console.error('Error adding room:', error)
        }
      }
    } else {
      if (validateForm()) {
        try {
          console.log('Sending request to add furniture to room with roomId:', roomId)
          await axios.post(`http://localhost:4000/rooms/${roomId}/furniture`, {
            name,
            model,
            roomId
          })

          setModalData({
            ...modalData,
            isOpen: false,
            addingFurnitureToRoom: false,
            roomId: ''
          })
          setFormData((prevData) => ({ ...prevData, name: '', model: '' }))
          fetchApartmentsAndRooms()
        } catch (error) {
          console.error('Error adding furniture:', error)
        }
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <Navigation />
      <h2>Room Page</h2>
      {apartments && apartments.length > 0 ? (
        <div>
          <button
            onClick={() =>
              setModalData({
                ...modalData,
                addingFurnitureToRoom: false,
                isOpen: true,
                roomId: ''
              })
            }
          >
            Add Room
          </button>
          <ul>
            {rooms?.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Apartment: {findApartmentName(item.apartmentId)}</p>
                <button onClick={() => handleAddFurniture(item.id.toString())}>
                  Add Furniture
                </button>
                <button onClick={() => handleDeleteOpen('room', item.id)}>Delete Room</button>

                {item && (
                  <ul>
                    {furnitureMap[item.id] &&
                      furnitureMap[item.id].map((furnitureItem) => (
                        <li key={furnitureItem.id}>
                          <p>Furniture: {furnitureItem.name}</p>
                          <button onClick={() => handleDeleteOpen('furniture', furnitureItem.id)}>
                            Delete Furniture
                          </button>
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
          onClose={() =>
            setModalData({ ...modalData, addingFurnitureToRoom: false, isOpen: false })
          }
          selectedId={formData.apartmentId}
          dropdownData={apartments || []}
          handleChange={change('apartmentId')}
          handleSubmit={handleSubmit}
          IdError={formData.IdError}
          addingFurnitureToRoom={modalData.addingFurnitureToRoom}
          inputs={inputs}
        />
      )}

      <DeleteModal
        isOpen={modalData.deleteModalOpen}
        type={modalData.type}
        onClose={() =>
          setModalData((prevModalData) => ({ ...prevModalData, deleteModalOpen: false }))
        }
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default RoomPage
