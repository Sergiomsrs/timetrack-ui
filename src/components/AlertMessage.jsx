import React from 'react';

export const AlertMessage = ({ isOpen, message }) => {
  if (!isOpen || !message) return null;

  const getStyles = () => {
    if (message.type === 'success') {
      return {
        container: 'bg-green-100 border border-green-400 text-green-800',
        icon: '✅',
      };
    }

    if (message.type === 'error') {
      return {
        container: 'bg-red-100 border border-red-400 text-red-800',
        icon: '❌',
      };
    }

    return {
      container: 'bg-gray-100 border border-gray-300 text-gray-800',
      icon: 'ℹ️',
    };
  };

  const { container, icon } = getStyles();

  return (
    <div className="">
      <div className={`rounded-xl shadow-xl px-6 py-4 max-w-md w-full flex items-center gap-3 animate-fade-in ${container}`}>
        <span className="text-2xl">{icon}</span>
        <p className="text-sm sm:text-base font-medium">{message.text}</p>
      </div>
    </div>
  );
};

