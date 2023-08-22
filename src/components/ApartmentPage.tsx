import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Modal from './Modal'
import DeleteModal from './ModalDelete'
import Navigation from './Navigation'
import { FormData } from '../Types/Apartment'
import { ModalData } from '../Types/Apartment'
import { useAppContext } from '../Context/AppContext'

const ApartmentPage: React.FC = () => {
  const { apartments, floors, roomsMap, furnitureMap, fetchApartmentsAndRooms, loading, error } =
    useAppContext()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    model: '',
    floorId: '',
    nameError: '',
    modelError: '',
    IdError: '',
    floorsData: []
  })

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    addingFurnitureToRoom: false,
    adding2: false,
    apartmentId: '',
    roomId: '',
    deleteModalOpen: false,
    itemToDelete: null,
    type: null
  })

  useEffect(() => {
    if (floors && floors.length > 0) {
      const formattedFloors = floors.map((apartment) => ({
        id: apartment.id.toString(),
        label: apartment.name
      }))
      setFormData((prevData) => ({
        ...prevData,
        roomsData: formattedFloors
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
    if (modalData.adding2) {
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
  }, [formData, handleNameChange])

  const findFloorName = (floorId: number) => {
    const floor = floors?.find((floor) => floor.id === floorId)
    return floor ? floor.name : ''
  }

  const handleDeleteOpen = (type: 'apartment' | 'room' | 'furniture', id: number) => {
    setModalData({
      ...modalData,
      deleteModalOpen: true,
      itemToDelete: id,
      type: type
    })
  }

  const handleDeleteConfirm = async () => {
    if (modalData.itemToDelete !== null) {
      try {
        switch (modalData.type) {
          case 'apartment':
            await axios.delete(`http://localhost:4000/apartments/${modalData.itemToDelete}`)
            break
          case 'room':
            await axios.delete(`http://localhost:4000/rooms/${modalData.itemToDelete}`)
            break
          case 'furniture':
            await axios.delete(`http://localhost:4000/furniture/${modalData.itemToDelete}`)
            break
          default:
            throw new Error('Invalid type for deletion')
        }
        fetchApartmentsAndRooms() // Or fetch only what's needed based on the type.
      } catch (error) {
        console.log(`Error deleting ${modalData.type}:`, error)
      }

      setModalData({
        ...modalData,
        deleteModalOpen: false,
        itemToDelete: null,
        type: null
      })
    }
  }

  const handleAddRoom = (apartmentId: string) => {
    setModalData({
      ...modalData,
      isOpen: true,
      addingFurnitureToRoom: true,
      adding2: false,
      apartmentId: apartmentId,
      roomId: ''
    })
  }

  const handleAddFurniture = (roomId: string) => {
    setModalData({
      ...modalData,
      isOpen: true,
      addingFurnitureToRoom: true,
      adding2: true,
      apartmentId: '',
      roomId: roomId
    })
  }

  const validateForm = () => {
    const { name, floorId } = formData
    let isValid = true

    if (!name.trim()) {
      setFormData((prevData) => ({ ...prevData, nameError: 'Name is required' }))
      isValid = false
    } else {
      setFormData((prevData) => ({ ...prevData, nameError: '' }))
    }

    if (!floorId && !modalData.addingFurnitureToRoom) {
      setFormData((prevData) => ({ ...prevData, IdError: 'Please select a floor' }))
      isValid = false
    } else {
      setFormData((prevData) => ({ ...prevData, IdError: '' }))
    }

    return isValid
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const { name, model, floorId } = formData
    const { apartmentId, roomId } = modalData

    if (!modalData.addingFurnitureToRoom) {
      if (validateForm()) {
        try {
          await axios.post('http://localhost:4000/apartments/', { name, floorId })
          setModalData({
            ...modalData,
            isOpen: false,
            addingFurnitureToRoom: false,
            adding2: false,
            apartmentId: '',
            roomId: ''
          })
          setFormData((prevData) => ({ ...prevData, name: '', model: '' }))
          fetchApartmentsAndRooms()
        } catch (error) {
          console.error('Error adding apartment:', error)
        }
      }
    } else if (!modalData.adding2) {
      if (validateForm()) {
        try {
          await axios.post(`http://localhost:4000/apartments/${apartmentId}/rooms`, {
            name,
            apartmentId
          })

          setModalData({
            ...modalData,
            isOpen: false,
            addingFurnitureToRoom: false,
            adding2: false,
            apartmentId: '',
            roomId: ''
          })
          setFormData((prevData) => ({ ...prevData, name: '', model: '' }))
          fetchApartmentsAndRooms()
        } catch (error) {
          console.error('Error adding room:', error)
        }
      }
    } else {
      try {
        console.log('Sending request to add furniture to room with roomId:', roomId)
        await axios.post(`http://localhost:4000/rooms/${roomId}/furniture`, { name, model, roomId })

        setModalData({
          ...modalData,
          isOpen: false,
          addingFurnitureToRoom: false,
          adding2: false,
          apartmentId: '',
          roomId: ''
        })
        setFormData((prevData) => ({ ...prevData, name: '', model: '' }))
        fetchApartmentsAndRooms()
      } catch (error) {
        console.error('Error adding furniture:', error)
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
      <h2>Apartment Page</h2>
      {floors && floors.length > 0 ? (
        <div>
          <button
            onClick={() =>
              setModalData({
                ...modalData,
                addingFurnitureToRoom: false,
                adding2: false,
                isOpen: true,
                apartmentId: '',
                roomId: ''
              })
            }
          >
            Add Apartment
          </button>
          <ul>
            {apartments?.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Floor: {findFloorName(item.floorId)}</p>
                <button onClick={() => handleAddRoom(item.id.toString())}>Add Room</button>
                <button onClick={() => handleDeleteOpen('apartment', item.id)}>Delete</button>

                {item && (
                  <ul>
                    {roomsMap[item.id] &&
                      roomsMap[item.id].map((roomItem) => (
                        <li key={roomItem.id}>
                          <p>Rooms: {roomItem.name}</p>
                          <button onClick={() => handleAddFurniture(roomItem.id.toString())}>
                            Add Furniture
                          </button>
                          <button onClick={() => handleDeleteOpen('room', roomItem.id)}>
                            Delete
                          </button>

                          {roomItem && (
                            <ul>
                              {furnitureMap[roomItem.id] &&
                                furnitureMap[roomItem.id].map((furnitureItem) => (
                                  <li key={furnitureItem.id}>
                                    <p>Furniture: {furnitureItem.name}</p>
                                    <button
                                      onClick={() =>
                                        handleDeleteOpen('furniture', furnitureItem.id)
                                      }
                                    >
                                      Delete
                                    </button>
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
          onClose={() =>
            setModalData({ ...modalData, addingFurnitureToRoom: false, isOpen: false })
          }
          selectedId={formData.floorId}
          dropdownData={floors || []}
          handleChange={change('floorId')}
          handleSubmit={handleSubmit}
          IdError={formData.IdError}
          addingFurnitureToRoom={modalData.addingFurnitureToRoom}
          inputs={inputs}
        />
      )}

      <DeleteModal
        isOpen={modalData.deleteModalOpen}
        type={modalData.type}
        onClose={() => setModalData({ ...modalData, deleteModalOpen: false })}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default ApartmentPage
