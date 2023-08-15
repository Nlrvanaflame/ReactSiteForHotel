import Room from "./Room";
import Floor from "./Floor";

interface Apartment {
    id: number;
    name: string;
    Floor: {
        name: string;
    };
    Rooms?: Room[];
}

export interface FormData {
    name: string;
    floorId: string;
    nameError: string;
    IdError: string;
    floorsData: Floor[];
}

export interface ModalData {
    isOpen: boolean;
    addingFurnitureToRoom: boolean;
    apartmentId: string;
}

export default Apartment;