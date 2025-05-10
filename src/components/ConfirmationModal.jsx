import React from 'react';

export const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{message}</h2>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

