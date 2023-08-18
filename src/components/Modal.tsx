import React, { ChangeEvent, FC, FormEvent } from 'react'

interface Input {
  title: string
  value: string
  changeValue: (event: ChangeEvent<HTMLInputElement>) => void
  error: string
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  selectedId: string
  dropdownData: { id: number; name: string }[]
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void
  handleSubmit: (event: FormEvent) => void
  IdError: string
  addingFurnitureToRoom: boolean
  inputs: Input[]
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  dropdownData,
  handleChange,
  handleSubmit,
  IdError,
  addingFurnitureToRoom,
  inputs
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal">
      <h2>Add </h2>
      <form onSubmit={handleSubmit}>
        {inputs.map((input) => (
          <div key={input.title}>
            <label>
              {input.title}:
              <input type="text" value={input.value} onChange={input.changeValue} />
            </label>
            {input.error && <p className="error">{input.error}</p>}
          </div>
        ))}

        {!addingFurnitureToRoom && (
          <div>
            <label>
              Placing:
              <select value={selectedId} onChange={handleChange} name="roomId">
                <option value="">Select</option>
                {dropdownData.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            {IdError && <p className="error">{IdError}</p>}
          </div>
        )}

        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </form>
    </div>
  )
}

export default Modal
