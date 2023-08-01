import React from 'react';

const Modal = ({ isOpen, onClose, name, selectedId, fields, handleNameChange, handleChange, handleSubmit, nameError, IdError }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <h2>Add </h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        {nameError && <p className="error">{nameError}</p>}

        {/* New select element for choosing the items */}
        <label>
          Placing:
          <select value={selectedId} onChange={handleChange}>
            <option value="">Select</option>
            {fields.map((items) => (
              <option key={items.id} value={items.id}>
                {items.name}
              </option>
            ))}
          </select>
        </label>
        {IdError && <p className="error">{IdError}</p>}

        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </form>
    </div>
  );
};

export default Modal;
