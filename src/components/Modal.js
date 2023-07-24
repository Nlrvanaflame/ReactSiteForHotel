import React from 'react';

const Modal = ({ isOpen, onClose, name, roomId, handleNameChange, handleRoomIdChange, handleSubmit, nameError, roomIdError }) => {
    if (!isOpen) {
      return null; 
    }
  
    return (
      <div className="modal">
        {/* Your modal content here */}
        <h2>Add Furniture</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={handleNameChange} />
          </label>
          {/* Display the name error message, if any */}
          {nameError && <p className="error">{nameError}</p>}
          <label>
            Room ID:
            <input type="text" value={roomId} onChange={handleRoomIdChange} />
          </label>
          {/* Display the roomId error message, if any */}
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


