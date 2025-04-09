import React, { useEffect, useState } from 'react';

export const Modal = ({ isOpen, setIsOpen, employeeId, dayRecords, employees, records }) => {
  const [editedRecords, setEditedRecords] = useState([]);

  // Filtrar registros del día seleccionado solo cuando `isOpen` cambie
  useEffect(() => {
    if (isOpen && records && dayRecords?.day) {
      const [d, m, y] = dayRecords.day.split('/').map(Number);

      const filtered = records.filter(record => {
        const date = new Date(record.timestamp);
        return (
          date.getDate() === d &&
          date.getMonth() === m - 1 &&
          date.getFullYear() === y
        );
      });

      const mapped = filtered.map(r => {
        const date = new Date(r.timestamp);
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toISOString().slice(0, 10); // yyyy-mm-dd
        return { ...r, time, dateStr };
      });

      setEditedRecords(mapped);
    }
  }, [isOpen, records, dayRecords]); // Dependemos de `isOpen`, `records`, y `dayRecords`

  // Actualizar la hora editada
  const handleTimeChange = (index, newTime) => {
    const updated = [...editedRecords];
    updated[index].time = newTime;

    // Actualizar timestamp combinando la fecha con la nueva hora
    const newTimestamp = new Date(`${updated[index].dateStr}T${newTime}:00`).toISOString();
    updated[index].timestamp = newTimestamp;

    setEditedRecords(updated);
  };

  // Añadir nuevo registro
  const handleAddRecord = () => {
    const [d, m, y] = dayRecords.day.split('/').map(Number);
    const dateObj = new Date(y, m - 1, d + 1);
    const dateStr = dateObj.toISOString().slice(0, 10); // yyyy-mm-dd
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord = {
      id: null,
      employeeId: employeeId,
      timestamp: `${dateStr}T${time}:00`,
      dateStr,
      time,
    };

    setEditedRecords([...editedRecords, newRecord]);
  };

  if (!isOpen || !dayRecords) return null;

  const selectedEmployee = employees.find(emp => emp.id === employeeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/80"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Encabezado */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles del día - {selectedEmployee?.name} {selectedEmployee?.lastName}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>

          {/* Cuerpo */}
          <div className="p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha:</p>
                <p className="text-base font-semibold">{dayRecords?.day}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total trabajado:</p>
                <p className="text-base font-semibold">{dayRecords?.totalWorked}</p>
              </div>
            </div>

            {/* Periodos */}
            <h4 className="text-lg font-medium">Turnos:</h4>
            <div className="space-y-3">
              {dayRecords?.periods?.map((period, index) => (
                <div key={index} className={`p-3 rounded-lg ${!period.isComplete ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Turno {index + 1}</span>
                    {!period.isComplete && (
                      <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded">
                        Falta salida
                      </span>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Entrada:</p>
                      <p>{period.entry}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Salida:</p>
                      <p>{period.exit || '--'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Duración:</p>
                      <p>
                        {period.durationMs > 0
                          ? `${Math.floor(period.durationMs / 3600000)}h ${Math.floor((period.durationMs % 3600000) / 60000)}m`
                          : '--'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Registros del día */}
            <h4 className="text-lg font-medium mt-6">Registros del día:</h4>
            <div className="space-y-2">
              {editedRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Fecha: {record.dateStr}</div>
                    <input
                      type="time"
                      value={record.time}
                      onChange={e => handleTimeChange(index, e.target.value)}
                      className="mt-1 border p-1 rounded"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddRecord}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                + Añadir nuevo registro
              </button>
            </div>
          </div>

          {/* Pie */}
          <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
