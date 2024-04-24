import Apartment from './Apartment'
import Hotel from './Hotel'

interface Floor {
  id: number
  name: string
  hotelId: number
  Hotel: {
    name: string
  }
  Apartments?: Apartment[]
}

export interface FormData {
  name: string
  model: string
  hotelId: string
  nameError: string
  modelError: string
  IdError: string
  hotelsData: { id: string; label: string }[]
}

export interface ModalData {
  isOpen: boolean
  addingFurnitureToRoom: boolean
  floorId: string
}

export default Floor
