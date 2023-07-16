import React, { useEffect, useState } from 'react';

const ElectricalEquipmentPage = () => {
  const [electricalEquipment, setElectricalEquipment] = useState([]);

  useEffect(() => {
    fetch('your-api-endpoint-for-electrical-equipment')
      .then(response => response.json())
      .then(data => setElectricalEquipment(data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h2>Electrical Equipment Page</h2>
      <ul>
        {electricalEquipment.map(item => (
          <li key={item.id}>
            <p>Name: {item.name}</p>
            <p>Room ID: {item.roomId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ElectricalEquipmentPage;
