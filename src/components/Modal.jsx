import React, { useEffect, useMemo, useState } from 'react';
import { filterAndMapRecords, parseTimeInput, processTimeStamps } from '../utilities/timeManagement';

export const Modal = ({ isOpen, setIsOpen, employeeId, selectedDayRecords, records, setRecords }) => {


  const [editedRecord, setEditedRecord] = useState(null); // Estado para el registro editado



  const processRecord = processTimeStamps(records, employeeId)
  const data = processRecord.find(record => record.data.day === selectedDayRecords);

  const dayRecords = filterAndMapRecords(records, selectedDayRecords);
  console.log("dayRecords", dayRecords);

  console.log("data", data);
  console.log("records", records);


  useEffect(() => {
    if (isOpen && records?.length) {
      setEditedRecord(data?.data);
    }
  }, [isOpen, records]);

  console.log("editedRecord", editedRecord);


  if (!isOpen) return null;

  // In your component:
  const handleTimeChange = (recordId, newTime, field) => {
    setEditedRecord(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        periods: prev.periods.map(period => {
          if (period.recordId !== recordId) return period;
          
          // Actualizar el campo correspondiente (entry o exit)
          const updatedPeriod = { ...period, [field]: newTime };
          
          // Si actualizamos ambos campos, calcular la duración
          if (updatedPeriod.entry && updatedPeriod.exit) {
            const entryDate = new Date(`${prev.day} ${updatedPeriod.entry}`);
            const exitDate = new Date(`${prev.day} ${updatedPeriod.exit}`);
            
            // Validar que la salida sea después de la entrada
            if (exitDate > entryDate) {
              updatedPeriod.durationMs = exitDate - entryDate;
              updatedPeriod.isComplete = true;
            } else {
              updatedPeriod.durationMs = 0;
              updatedPeriod.isComplete = false;
            }
          } else {
            updatedPeriod.durationMs = 0;
            updatedPeriod.isComplete = false;
          }
          
          return updatedPeriod;
        })
      };
    });
  };
  const handleAddRecord = () => {};

  const handleSaveRecord = async (recordId) => {
    const recordToSave = editableRecords.find(r => r.id === recordId);
    if (!recordToSave) return alert("No se encontró el registro.");

    try {
      const isNew = String(recordId).startsWith('temp');
      const url = isNew
        ? 'http://localhost:8080/api/timestamp/timestamp'
        : `http://localhost:8080/api/timestamp/${recordId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: isNew ? recordToSave.employeeId : "",
          timestamp: recordToSave.timestamp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      const newRecord = {
        employeeId: recordToSave.employeeId,
        timestamp: recordToSave.timestamp,
        id: ""
      }


      setDayRecords(prev => ({
        ...prev,
        periods: prev.periods.map((period, index) => {
          if (index === recordToSave.index) {
            return {
              ...period,
              entry: recordToSave.time,
              exit: recordToSave.time,
              durationMs: 0,
              isComplete: false,
            };
          }
          return period;
        }),
      }));





      alert(isNew ? "Registro guardado." : "Registro actualizado.");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert(err.message);
    }
  };
  const handleDeleteRecord = async (recordId) => {
    
    try {
      const res = await fetch(`http://localhost:8080/api/timestamp/${recordId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Error HTTP: ${res.status}`);
      }

      //setEditableRecords(prev => prev.filter(r => r.id !== recordId));
      alert("Registro eliminado.");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(err.message);
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
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detalles del día</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha:</p>
                <p className="text-base font-semibold">{data.data.day}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total trabajado:</p>
                <p className="text-base font-semibold">{data.data?.totalWorked}</p>
              </div>
            </div>

            <h4 className="text-lg font-medium">Turnos:</h4>
            <div className="space-y-3">
              {data.data?.periods?.map((period, index) => (
                <div key={index} className={`p-3 rounded-lg ${!period?.isComplete ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Turno {index + 1}</span>
                    {!period.isComplete && (
                      <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded">
                        Falta salida
                      </span>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div><p className="text-gray-500 dark:text-gray-400">Entrada:</p><p>{period.entry}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Salida:</p><p>{period.exit || '--'}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400">Duración:</p><p>{period.durationMs > 0 ? `${Math.floor(period.durationMs / 3600000)}h ${Math.floor((period.durationMs % 3600000) / 60000)}m` : '--'}</p></div>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-lg font-medium mt-6">Registros del día:</h4>
            <div className="space-y-2">
              {editedRecord?.periods.map((record, index) => (
                <div key={record.recordId}>
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <div className="w-full">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Fecha: {data.data.day}</div>
                      <div className="flex items-center gap-4 mt-1">
                        <input
                          type="time"
                          value={record.entry || ''}
                          onChange={(e) => handleTimeChange(record.recordId, e.target.value, 'entry')}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                        <button
                          onClick={() => handleSaveRecord(record.entryID)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
                        >
                          {String(record.id).startsWith('temp') ? 'Guardar' : 'Enviar'}
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.entryID)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                  {(record.exit || record.isBeingEdited) && (
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <div className="w-full">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Fecha: {data.data.day}</div>
                        <div className="flex items-center gap-4 mt-1">
                          <input
                            type="time"
                            value={record.exit || ''}
                            onChange={(e) => handleTimeChange(record.recordId, e.target.value, 'exit')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />

                          <button
                            onClick={() => handleSaveRecord(record.exitID)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full"
                          >
                            {String(record.id).startsWith('temp') ? 'Guardar' : 'Enviar'}
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  )

                  }

                </div>

              ))}
              <button
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                + Añadir nuevo registro
              </button>
            </div>
          </div>

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