import React from 'react';

const Modal = ({
  isOpen,
  onClose,
  name,
  selectedId,
  fields,
  handleNameChange,
  handleChange,
  handleSubmit,
  inputs,
  nameError,
  IdError,
  addingFurnitureToRoom,
}) => {
  if (!isOpen) {
    return null;
  }

  const modalTitle = addingFurnitureToRoom ? 'Add Furniture' : 'Add Room';

  return (
    <div className="modal">
      <h2> {modalTitle} </h2>
      <form onSubmit={handleSubmit}>


        {inputs.map(input => {
          return <>
            <label>
              {input.title}:
              <input type="text" value={input.value} onChange={input.changeValue} />
            </label>

            {input.error && <p className="error">{input.error}</p>}
          </>
        })}



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
