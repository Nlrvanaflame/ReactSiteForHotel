

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

export default Room;