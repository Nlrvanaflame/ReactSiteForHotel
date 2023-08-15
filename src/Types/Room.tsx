import Apartment from "./Apartment";

interface Room {
    id: number;
    name: string;
    Apartment: {
        name: string;
    };
    Furniture?: {
        id: number;
        name: string;
    }[];
}

export interface FormData {
    name: string;
    model: string;
    apartmentId: string;
    nameError: string;
    modelError: string;
    IdError: string;
    apartmentsData: Apartment[];
}

export interface ModalData {
    isOpen: boolean;
    addingFurnitureToRoom: boolean;
    roomId: string;
}


export default Room;