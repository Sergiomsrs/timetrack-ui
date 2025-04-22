import React, { useEffect, useState } from 'react';
import { filterAndMapRecords } from '../utilities/timeManagement';

export const Modal = ({ isOpen, setIsOpen, employeeId, dayRecords, employees, records }) => {

  // Arreglo con los registros para editar la hora o crear nuevos
  const [editableRecords, setEditableRecords] = useState([]);

  // Filtra los registros para mostrar solo los del día seleccionado
  useEffect(() => {
    if (isOpen && records && dayRecords?.day) {
      setEditableRecords(filterAndMapRecords(records, dayRecords.day))
    }
  }, [isOpen, records, dayRecords]);

  // evita renderizar el modal si no está abierto o no hay registros del día
  if (!isOpen || !dayRecords) return null;

  // Modifica editableRecords en funcion del imput tipo time de los registros del dia
  const handleTimeChange = (index, newTime) => {
    const updatedRecords = [...editableRecords];
    const record = updatedRecords[index];
   // const [year, month, day] = record.dateStr.split('-');

   // Extrae las horas y minutos del nuevo tiempo
    const [hours, minutes] = newTime.split(':');

    // Genera un nuevo timestamp
    const newTimestamp = `${record.dateStr}T${hours}:${minutes}:00.000`;
    // Actualiza el registro con el nuevo timestamp y tiempo
    updatedRecords[index] = {
      ...record,
      timestamp: newTimestamp,
      time: newTime
    };
    // Actualiza el estado con los registros editados
    setEditableRecords(updatedRecords);
  };
  // Añade un nuevo campo de registro al formulario
  const handleAddRecord = () => {
    const [d, m, y] = dayRecords.day.split('/').map(Number);
    const now = new Date();
    const localDate = new Date(y, m - 1, d, now.getHours(), now.getMinutes(), 0);
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timestamp = `${dateStr}T${time}:00.000`;

    const tempId = `temp-${Date.now()}`;

    const newRecord = {
      id: `temp-${timestamp}`, // ID temporal que siempre es un string
      employeeId: employeeId,
      timestamp: timestamp, 
      dateStr: dateStr,
      time: time,
    };

    setEditableRecords([...editableRecords, newRecord]);
  };
  console.log(editableRecords)

  const handleSaveRecord = async (recordId) => {
    const recordToSave = editableRecords.find(record => record.id === recordId);
  
    if (!recordToSave) {
      alert("No se encontró el registro para guardar.");
      return;
    }
  
    try {
      // Determinar si es creación (POST) o actualización (PATCH)
      const isNewRecord = recordId.startsWith('temp');
      const url = isNewRecord 
        ? 'http://localhost:8080/api/timestamp/timestamp'
        : `http://localhost:8080/api/timestamp/${recordId}`;
  
      const method = isNewRecord ? 'POST' : 'PATCH';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: recordToSave.employeeId,
          timestamp: recordToSave.timestamp
        })
      });
  
      // Manejar la respuesta
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      // Actualizar el estado
      setEditableRecords(prev =>
        prev.map(record =>
          record.id === recordId
            ? {
                ...record,
                id: isNewRecord ? responseData.id : record.id,
                synced: true
              }
            : record
        )
      );
  
      alert(isNewRecord 
        ? "Registro guardado correctamente." 
        : "Registro actualizado correctamente.");
  
    } catch (error) {
      console.error(`Error al ${recordId.startsWith('temp') ? 'guardar' : 'actualizar'} el registro:`, error);
      alert(error.message);
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
              {editableRecords.map((record, index) => {

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
                          onClick={() => handleSaveRecord(record.id)}
                        >
                          {String(record.id).startsWith('temp') ? 'Guardar' : 'Enviar'}
                        </button>
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
