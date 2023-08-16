


import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import Floor from '../Types/Floor';
import Apartment from '../Types/Apartment';
import Room from '../Types/Room';
import Furniture from '../Types/Furniture';
import Hotel from '../Types/Hotel';


interface AppData {
    hotels?: Hotel[];
    floors?: Floor[];
    apartments?: Apartment[];
    rooms?: Room[];
    furnitures?: Furniture[];
}

interface AppContextType extends AppData {

    setHotels: (hotels: Hotel[]) => void;
    setFloors: (floors: Floor[]) => void;
    setApartments: (apartments: Apartment[]) => void;
    setRooms: (rooms: Room[]) => void;
    setFurniture: (furnitures: Furniture[]) => void;
    fetchApartmentsAndRooms: () => void;
    loading: boolean;
    error: Error | null;
}
interface AppProviderProps {
    children: React.ReactNode;
}



const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {


    const [appData, setAppData] = useState<AppData>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchApartmentsAndRooms = async () => {
        setLoading(true);
        try {
            const [appDataResponse] = await Promise.all([
                axios.get<AppData>('http://localhost:4000/alldata/'),
            ]);

            setAppData(appDataResponse.data)

            console.log("appdata resp is here", appDataResponse.data)

            console.log("Furniture data fetched:", appDataResponse.data.furnitures);
        } catch (error) {
            setError(error as Error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApartmentsAndRooms();
    }, []);






    const contextValue: AppContextType = {
        setHotels: (hotels: Hotel[]) => {
            setAppData((old) => {
                return {
                    ...old,
                    hotels,
                }
            })
        },
        setFloors: (floors: Floor[]) => {
            setAppData((old) => {
                return {
                    ...old,
                    floors,
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
                    rooms,
                }
            })
        },
        setFurniture: (furnitures: Furniture[]) => {
            console.log("Setting furniture data:", furnitures);
            setAppData((old) => {
                return {
                    ...old,
                    furnitures,
                }
            })
        },
        ...appData,
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
