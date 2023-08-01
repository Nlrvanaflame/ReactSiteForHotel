import React from 'react';

const Modal = ({ isOpen, onClose, name, selectedId, rooms, handleNameChange, handleRoomChange, handleSubmit, nameError, roomIdError }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <h2>Add Furniture</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        {nameError && <p className="error">{nameError}</p>}

        {/* New select element for choosing the room */}
        <label>
          Room:
          <select value={selectedId} onChange={handleRoomChange}>
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
        {roomIdError && <p className="error">{roomIdError}</p>}

        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </form>
    </div>
  );
};

export default Modal;
