import Room from "./Room";

interface Apartment {
    id: number;
    name: string;
    Floor: {
        name: string;
    };
    Rooms?: Room[];
}

export default Apartment;