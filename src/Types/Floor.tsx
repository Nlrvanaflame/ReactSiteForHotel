import Apartment from "./Apartment";

interface Floor {
    id: number;
    name: string;
    Hotel: {
        name: string;
    };
    Apartments?: Apartment[];
}

export default Floor;