import React, { useEffect, useState } from 'react';

export const Modal = ({ isOpen, setIsOpen, employeeId, dayRecords, employees, records }) => {

  const [editedRecords, setEditedRecords] = useState([]);

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
  }, [isOpen, records, dayRecords]); 

  if (!isOpen || !dayRecords) return null;


  const handleTimeChange = (index, newTime) => {
    const updatedRecords = [...editedRecords];
    const record = updatedRecords[index];

  
    const [year, month, day] = record.dateStr.split('-');
    const [hours, minutes] = newTime.split(':');

 
    const newTimestamp = `${record.dateStr}T${hours}:${minutes}:00.000`;

    updatedRecords[index] = {
      ...record,
      timestamp: newTimestamp,
      time: newTime
    };

    setEditedRecords(updatedRecords);
  };

  
  const handleAddRecord = () => {
    const [d, m, y] = dayRecords.day.split('/').map(Number);
    const now = new Date();

   
    const localDate = new Date(y, m - 1, d, now.getHours(), now.getMinutes(), 0);

    
    const dateStr = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

   
    const timestamp = `${dateStr}T${time}:00.000`;

    const newRecord = {
      id: null,
      employeeId: employeeId,
      timestamp: timestamp, 
      dateStr: dateStr,
      time: time,
    };

    setEditedRecords([...editedRecords, newRecord]);
  };


  const handeladdEdited = async (id) => {
    try {
      const editedRecord = editedRecords.find(record => record.id === id);

      if (!editedRecord) {
        console.error("Registro no encontrado para editar.");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/timestamp/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: editedRecord.timestamp
        })
      });

      
      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || `Error HTTP: ${response.status}`);
      }

      console.log("Respuesta del servidor:", responseText);

     
      setEditedRecords(prev =>
        prev.map(record =>
          record.id === id ? { ...record, synced: true } : record
        )
      );

      
      alert(responseText); 

    } catch (error) {
      console.error("Error al actualizar el registro:", error);
     
      alert(error.message);

     
      setEditedRecords(prev => [...prev]);
    }
  };

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
              Detalles del día
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
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
              {editedRecords.map((record, index) => {
                
                return (
                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Fecha: {record.dateStr}
                      </div>
                      <div className='flex items-center gap-4'>

                        <input
                          type="time"
                          value={record.time}
                          onChange={e => handleTimeChange(index, e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                        <button
                          className='bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full'
                          onClick={() => handeladdEdited(record.id)}>Editar</button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
