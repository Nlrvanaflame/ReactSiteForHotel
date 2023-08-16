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
    model: string;
    floorId: string;
    nameError: string;
    modelError: string;
    IdError: string;
    floorsData: { id: string; label: string }[];
}

export interface ModalData {
    isOpen: boolean;
    addingFurnitureToRoom: boolean;
    apartmentId: string;
    adding2: boolean;
    roomId: string,
}

export default Apartment;