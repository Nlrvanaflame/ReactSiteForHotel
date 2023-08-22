import React, { FC } from 'react'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: 'apartment' | 'room' | 'furniture' | null
}

const DeleteModal: FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="modal">
      <p>Are you sure about that?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onClose}>No</button>
    </div>
  )
}

export default DeleteModal
