import Room from "./Room";

interface Furniture {
    id: number;
    name: string;
    model: string;
    roomId: number;
    Room: {
        id: number;
    };
}

export interface FormData {
    name: string;
    model: string;
    roomId: string;
    nameError: string;
    modelError: string;
    IdError: string;
    roomsData: { id: string; label: string }[];
}

export interface ModalData {
    isOpen: boolean;
    addingFurnitureToRoom: boolean;
}


export default Furniture;