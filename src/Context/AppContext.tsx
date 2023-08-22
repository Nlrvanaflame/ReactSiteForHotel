import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import axios from 'axios'

import Floor from '../Types/Floor'
import Apartment from '../Types/Apartment'
import Room from '../Types/Room'
import Furniture from '../Types/Furniture'
import Hotel from '../Types/Hotel'

interface AppData {
  hotels?: Hotel[]
  floors?: Floor[]
  apartments?: Apartment[]
  rooms?: Room[]
  furnitures?: Furniture[]
}

interface AppContextType extends AppData {
  setHotels: (hotels: Hotel[]) => void
  setFloors: (floors: Floor[]) => void
  setApartments: (apartments: Apartment[]) => void
  setRooms: (rooms: Room[]) => void
  setFurniture: (furnitures: Furniture[]) => void
  fetchApartmentsAndRooms: () => void
  loading: boolean
  error: Error | null
  furnitureMap: {
    [key: number]: Furniture[]
  }
  roomsMap: {
    [key: number]: Room[]
  }
  apartmentsMap: {
    [key: number]: Apartment[]
  }
}
interface AppProviderProps {
  children: React.ReactNode
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appData, setAppData] = useState<AppData>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchApartmentsAndRooms = async () => {
    setLoading(true)
    try {
      const [appDataResponse] = await Promise.all([
        axios.get<AppData>('http://localhost:4000/alldata/')
      ])

      setAppData(appDataResponse.data)
    } catch (error) {
      setError(error as Error)
    }
    setLoading(false)
  }
  console.log('sdfewsf', appData)

  useEffect(() => {
    fetchApartmentsAndRooms()
  }, [])

  const convert = <T, K extends keyof T>(array: T[], property: K): { [key: number]: T[] } => {
    const resultObj: { [key: number]: T[] } = {}

    array?.forEach((item) => {
      const keyValue = Number(item[property])
      if (resultObj[keyValue]) {
        resultObj[keyValue].push(item)
      } else {
        resultObj[keyValue] = [item]
      }
    })

    return resultObj
  }

  const furnitureMap: { [key: number]: Furniture[] } = useMemo(() => {
    return convert<Furniture, 'roomId'>(appData.furnitures || [], 'roomId')
  }, [appData])

  const roomsMap: { [key: number]: Room[] } = useMemo(() => {
    return convert<Room, 'apartmentId'>(appData.rooms || [], 'apartmentId')
  }, [appData])

  const apartmentsMap: { [key: number]: Apartment[] } = useMemo(() => {
    return convert<Apartment, 'floorId'>(appData.apartments || [], 'floorId')
  }, [appData])

  const contextValue: AppContextType = {
    setHotels: (hotels: Hotel[]) => {
      setAppData((old) => {
        return {
          ...old,
          hotels
        }
      })
    },
    setFloors: (floors: Floor[]) => {
      setAppData((old) => {
        return {
          ...old,
          floors
        }
      })
    },
    setApartments: (apartments: Apartment[]) => {
      setAppData((old) => {
        return {
          ...old,
          apartments
        }
      })
    },
    setRooms: (rooms: Room[]) => {
      setAppData((old) => {
        return {
          ...old,
          rooms
        }
      })
    },
    setFurniture: (furnitures: Furniture[]) => {
      console.log('Setting furniture data:', furnitures)
      setAppData((old) => {
        return {
          ...old,
          furnitures
        }
      })
    },
    ...appData,
    fetchApartmentsAndRooms,
    loading,
    error,
    furnitureMap,
    roomsMap,
    apartmentsMap
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export { AppProvider, useAppContext }
