import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Modal from './Modal'
import Navigation from './Navigation'
import Hotel from '../Types/Hotel'
import Floor from '../Types/Floor'
import { ModalData } from '../Types/Floor'
import { FormData } from '../Types/Floor'
import { useAppContext } from '../Context/AppContext'

const FloorPage: React.FC = () => {
  const { hotels, floors, apartments, fetchApartmentsAndRooms, loading, error } = useAppContext()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    hotelId: '',
    nameError: '',
    IdError: '',
    hotelsData: []
  })

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    addingFurnitureToRoom: false,
    floorId: ''
  })

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      const formattedHotels = hotels.map((hotel) => ({
        id: hotel.id.toString(),
        label: hotel.name
      }))
      setFormData((prevData) => ({
        ...prevData,
        hotelsData: formattedHotels
      }))
    }
  }, [hotels])

  const floorsWithHotels = floors || []
  const apartmentsWithFoors = apartments || []

  const change =
    (key: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value
      setFormData({
        ...formData,
        [key]: value
      })
    }

  const handleChange = change('hotelId')
  const handleNameChange = change('name')

  const inputs = useMemo(() => {
    return [
      {
        title: 'Name',
        value: formData.name,
        changeValue: handleNameChange,
        error: formData.nameError
      }
    ]
  }, [formData, handleNameChange])

  const findHotelName = (hotelId: number) => {
    const hotel = hotels?.find((hotel) => hotel.id === hotelId)
    return hotel ? hotel.name : ''
  }

  const validateForm = () => {
    const { name, hotelId } = formData
    let isValid = true

    if (!name.trim()) {
      setFormData((prevData) => ({ ...prevData, nameError: 'Name is required' }))
      isValid = false
    } else {
      setFormData((prevData) => ({ ...prevData, nameError: '' }))
    }

    if (!hotelId && !modalData.addingFurnitureToRoom) {
      setFormData((prevData) => ({ ...prevData, IdError: 'Please select a hotel' }))
      isValid = false
    } else {
      setFormData((prevData) => ({ ...prevData, IdError: '' }))
    }

    return isValid
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/floors/${id}`)
      fetchApartmentsAndRooms()
    } catch (error) {
      console.log('Error deleting floor:', error)
    }
  }

  const handleAddApartment = (floorId: string) => {
    setModalData({
      isOpen: true,
      addingFurnitureToRoom: true,
      floorId
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const { name, hotelId } = formData
    const { floorId } = modalData

    if (!modalData.addingFurnitureToRoom) {
      if (validateForm()) {
        try {
          await axios.post('http://localhost:4000/floors/', { name, hotelId })
          setModalData({
            isOpen: false,
            addingFurnitureToRoom: false,
            floorId: ''
          })
          fetchApartmentsAndRooms()
        } catch (error) {
          console.error('Error adding floor:', error)
        }
      }
    } else {
      if (validateForm()) {
        try {
          await axios.post(`http://localhost:4000/floors/${floorId}/apartments`, { name, floorId })

          setModalData({
            isOpen: false,
            addingFurnitureToRoom: false,
            floorId: ''
          })
          fetchApartmentsAndRooms()
        } catch (error) {
          console.error('Error adding apartment:', error)
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
      <h2>Floor Page</h2>
      {hotels && hotels.length > 0 ? (
        <div>
          <button
            onClick={() =>
              setModalData({ addingFurnitureToRoom: false, isOpen: true, floorId: '' })
            }
          >
            Add Floor
          </button>
          <ul>
            {floors?.map((item) => (
              <li key={item.id}>
                <p>Name: {item.name}</p>
                <p>Hotel: {findHotelName(item.hotelId)}</p>
                <button onClick={() => handleAddApartment(item.id.toString())}>
                  Add Apartment
                </button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>

                {item && (
                  <ul>
                    {apartmentsWithFoors.map((apartmentItem) => (
                      <li key={apartmentItem.id}>
                        <p>Apartment: {apartmentItem.name}</p>
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
        <p>No existing hotels. Please create a hotel first.</p>
      )}

      {modalData.isOpen && (
        <Modal
          isOpen={modalData.isOpen}
          onClose={() =>
            setModalData({ ...modalData, addingFurnitureToRoom: false, isOpen: false })
          }
          selectedId={formData.hotelId}
          dropdownData={hotels || []}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          IdError={formData.IdError}
          addingFurnitureToRoom={modalData.addingFurnitureToRoom}
          inputs={inputs}
        />
      )}
    </div>
  )
}

export default FloorPage
