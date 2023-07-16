import React, { useEffect, useState } from 'react';
import axios from "axios"



const FurniturePage = () => {
  const [furniture, setFurniture] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching furniture data...');
        const response = await axios.get('http://localhost:4000/furniture/');
        console.log('Fetched furniture data:', response.data);
        setFurniture(response.data);
        setLoading(false);
     

      } catch (error) {
        console.log('Error fetching furniture data:', error);
        setError(error);
        setLoading(false);
      }
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
      <h2>Furniture Page</h2>
      <ul>
        {console.log('Furniture:', furniture)}
        {furniture.map(item => (
          <li key={item.id}>
            <p>Name: {item.name}</p>
            <p>Room ID: {item.roomId}</p>
          </li>
        ))}
      </ul>
    </div>
  ); 
}

export default FurniturePage;

