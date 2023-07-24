import React, { useEffect, useState } from 'react';
import axios from "axios"


const ElectricalEquipmentPage = () => {
  const [electricalEquipment, setElectricalEquipment] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching electrical equip data...');
        const response = await axios.get("http://localhost:4000/electricalEquipment/");
        console.log('Fetched el equip data:', response.data);
        setElectricalEquipment(response.data);
      } catch (error) {
        console.log('Error fetching el equip data:', error);
        setError(error);
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>ElectricalEquipmentPage</h2>
      <ul>
        {console.log('ElectricalEquipment:', electricalEquipment)}
        {electricalEquipment.map(item => (
          <li key={item.id}>
            <p>Name: {item.name}</p>
            <p>Room ID: {item.roomId}</p>
          </li>
        ))}
      </ul>
    </div>
  ); 
}


export default ElectricalEquipmentPage;
