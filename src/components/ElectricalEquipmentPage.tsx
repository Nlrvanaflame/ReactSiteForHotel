import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface ElectricalEquipment {
  id: number
  name: string
  roomId: number
}

const ElectricalEquipmentPage: React.FC = () => {
  const [electricalEquipment, setElectricalEquipment] = useState<ElectricalEquipment[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        console.log('Fetching electrical equip data...')
        const response = await axios.get<ElectricalEquipment[]>(
          'http://localhost:4000/electricalEquipment/'
        )
        console.log('Fetched el equip data:', response.data)
        setElectricalEquipment(response.data)
      } catch (error) {
        console.log('Error fetching el equip data:', error)
        setError(error as Error)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h2>ElectricalEquipmentPage</h2>
      <ul>
        {electricalEquipment.map((item) => (
          <li key={item.id}>
            <p>Name: {item.name}</p>
            <p>Room ID: {item.roomId}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ElectricalEquipmentPage
