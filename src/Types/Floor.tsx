import Apartment from "./Apartment";
import Hotel from "./Hotel";

interface Floor {
    id: number;
    name: string;
    Hotel: {
        name: string;
    };
    Apartments?: Apartment[];
}

export interface FormData {
    name: string;
    hotelId: string;
    nameError: string;
    IdError: string;
    hotelsData: Hotel[];
}

export interface ModalData {
    isOpen: boolean;
    addingFurnitureToRoom: boolean;
    floorId: string;
}

export default Floor;