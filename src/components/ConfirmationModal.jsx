import React from 'react';

export const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null; // No renderiza nada si el modal no está abierto

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Confirmación</h3>
        </div>
        <div className="text-center mb-6">
          <p>{message}</p>
        </div>
        <div className="flex justify-around">
          <button
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

