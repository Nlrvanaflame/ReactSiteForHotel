import React, { useEffect, useState } from 'react';
import axios from "axios";
import Modal from './Modal';

const RoomPage = () => {
    const [room, setRoom] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apartments, setApartments] = useState([]);
    const [selectedApartmentId, setSelectedApartmentId] = useState('');

    //Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [apartmentId, setApartmentId] = useState('');
  const [nameError, setNameError] = useState('');
  const [apartmentIdError, setApartmentIdError] = useState('');


    return(
        <div>
            ahaajajja
        </div>
    )


}

export default RoomPage