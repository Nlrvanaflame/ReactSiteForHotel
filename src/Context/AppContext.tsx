


import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import Floor from '../Types/Floor';
import Apartment from '../Types/Apartment';
import Room from '../Types/Room';
import Furniture from '../Types/Furniture';
import Hotel from '../Types/Hotel';


interface AppContextType {
    hotels: Hotel[];
    floors: Floor[];
    apartments: Apartment[];
    rooms: Room[];
    furniture: Furniture[];
    fetchApartmentsAndRooms: () => void;
    loading: boolean;
    error: Error | null;
}
interface AppProviderProps {
    children: React.ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [furniture, setFurniture] = useState<Furniture[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchApartmentsAndRooms = async () => {
        setLoading(true);
        try {
            const [hotelsResponse, floorsResponse, apartmentsResponse, roomsResponse, furnitureResponse] = await Promise.all([
                axios.get<Hotel[]>('http://localhost:4000/hotels/'),
                axios.get<Floor[]>('http://localhost:4000/floors/'),
                axios.get<Apartment[]>('http://localhost:4000/apartments/'),
                axios.get<Room[]>('http://localhost:4000/rooms/'),
                axios.get<Furniture[]>('http://localhost:4000/furniture/'),
            ]);
            setHotels(hotelsResponse.data)
            setFloors(floorsResponse.data);
            setApartments(apartmentsResponse.data);
            setRooms(roomsResponse.data);
            setFurniture(furnitureResponse.data);
        } catch (error) {
            setError(error as Error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApartmentsAndRooms();
    }, []);

    const contextValue: AppContextType = {
        hotels,
        floors,
        apartments,
        rooms,
        furniture,
        fetchApartmentsAndRooms,
        loading,
        error
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export { AppProvider, useAppContext };
