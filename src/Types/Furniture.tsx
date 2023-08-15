import Room from "./Room";

interface Furniture {
    id: number;
    name: string;
    model: string;
    Room: {
        name: string;
    };
}

export interface FormData {
    name: string;
    model: string;
    roomId: string;
    nameError: string;
    modelError: string;
    IdError: string;
    roomsData: Room[];
}

export interface ModalData {
    isOpen: boolean;
    addingFurnitureToRoom: boolean;
}


export default Furniture;