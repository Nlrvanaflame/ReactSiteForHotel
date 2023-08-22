import Apartment from './Apartment'

interface Room {
  id: number
  name: string
  apartmentId: number
  Apartment: {
    name: string
  }
  Furniture?: {
    id: number
    name: string
  }[]
}

export interface FormData {
  name: string
  model: string
  apartmentId: string
  nameError: string
  modelError: string
  IdError: string
  apartmentsData: { id: string; label: string }[]
}

export interface ModalData {
  isOpen: boolean
  addingFurnitureToRoom: boolean
  roomId: string
  deleteModalOpen: boolean
  itemToDelete: number | null
  type: 'apartment' | 'room' | 'furniture' | null
}

export default Room
