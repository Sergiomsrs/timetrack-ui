import React, { useContext, useEffect, useState } from 'react';
import { filterAndMapRecords } from '../utilities/timeManagement';
import { AuthContext } from '../context/AuthContext';
import { ConfirmModal } from './ConfirmationModal';

export const Modal = ({ isOpen, setIsOpen, employeeId, selectedDayRecords, records, setRecords }) => {

  const { auth } = useContext(AuthContext);

  const [isConOpen, setIsConOpenModal] = useState(false);
  const [recordToOperate, setRecordToOperate] = useState(null);
  const [action, setAction] = useState(null);
  const [message, setMessage] = useState(null);
  
  

  const [editableRecords, setEditableRecords] = useState([]);
  const [dayRecords, setDayRecords] = useState({
    id: null,
    data: {
      day: '',
      periods: [],
      totalWorked: '',
      recordsCount: 0,
      warning: null
    }
  });
  

  // Si selectedDayRecords es null o undefined, no se hace nada
  // Carga la informacion de selectedDayRecords en day records
  useEffect(() => {
    if (isOpen && selectedDayRecords?.data) {
      setDayRecords(selectedDayRecords.data);
    }
  }, [isOpen, selectedDayRecords?.data]);


  // Filtra los record y rellena editableRecords con los registros del dia seleccionado
  useEffect(() => {
    if (isOpen && dayRecords?.day && records?.length) {
      const filtered = filterAndMapRecords(records, dayRecords.day);
      setEditableRecords(filtered);
    }
  }, [isOpen, dayRecords?.day, records]);

  // Si el modal no está abierto o no hay registros del día, no renderiza nada
  if (!isOpen || !dayRecords) return null;

  // Maneja los imput de tiempo y los guarda en editableRecords
  const handleTimeChange = (index, newTime) => {
    const updatedRecords = [...editableRecords];
    const record = updatedRecords[index];

    if (!newTime.match(/^\d{2}:\d{2}$/)) return;

    const [hours, minutes] = newTime.split(':');
    const newTimestamp = `${record.dateStr}T${hours}:${minutes}:00.000`;


    updatedRecords[index] = {
      ...record,
      timestamp: newTimestamp,
      time: newTime,
    };

    setEditableRecords(updatedRecords);
  };

  // Maneja la adición de nuevos registros
  // Crea un nuevo registro temporal y lo añade a editableRecords
  const handleAddRecord = () => {
    const [day, month, year] = dayRecords.day.split('/').map(Number);
    const now = new Date();
    const date = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), 0);
    const dateStr = date.toISOString().slice(0, 10);
    const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    const timestamp = `${dateStr}T${time}:00.000`;
    // Generamos un id temporal
    const newRecord = {
      id: `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      employeeId,
      timestamp,
      dateStr,
      time // Cambiar a false si no es un nuevo registro
    };
    // Se añade el nuevo registro a editableRecords
    setEditableRecords(prev => [...prev, newRecord]);
  };

  // Funcion para guardar o actualizar un registro
const handleSaveRecord = async (recordId) => {

    
    // Buscamos en editable records el recor que coincida en id con la que le estamos pasando al metodo
    const recordToSave = editableRecords.find(r => r.id === recordId);
    if (!recordToSave) return alert("No se encontró el registro.");

    // Hacemos save o update en funcion del id, si es temporal o definitivo
    try {
      const isNew = String(recordId).startsWith('temp');
      const url = isNew
        ? 'http://localhost:8080/api/timestamp/timestamp'
        : `http://localhost:8080/api/timestamp/${recordId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
         },
        body: JSON.stringify({
          employeeId: isNew ? recordToSave.employeeId : "",
          timestamp: recordToSave.timestamp,
          isMod: "true", // Cambiar a false si no es un nuevo registro
        }),
      });

      


      // Lanzamos mensaje de error en caso de fallo en la consulta
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      /* Actualizar la interfaz */
      const updatedRecord = {
        employeeId: recordToSave.employeeId,
        timestamp: recordToSave.timestamp,
        id: recordId, // Usar el ID del servidor, si es necesario
        isMod: "true",
      };

      // Eliminar el registro temporal (si es un nuevo registro)
      setEditableRecords(prev => prev.filter(r => r.id !== recordId));

      // Si el registro es nuevo, lo añadimos
      if (isNew) {
        setRecords(prev => [...prev, updatedRecord]);
      } else {
        // Si es un registro modificado, actualizamos el existente
        setRecords(prev => prev.map(r => (r.id === recordId ? updatedRecord : r)));
      }

    } catch (err) {
      console.log("TOKEN ENVIADO:", auth.token);
      console.error("Error al guardar:", err);
      alert(err.message);
    }

    setIsOpen(false);
};

  const onOpenModal = (id, action) => {
    
    setRecordToOperate(id);
    setIsConOpenModal(true);
    setAction(action);
    setMessage(action == "delete"? "¿Estás seguro de que deseas eliminar este registro?" : "¿Estás seguro de que deseas guardar este registro?");
   }

   const onConfirmDelete = () => {
    handleDeleteRecord(recordToOperate); 
    setRecordToOperate(null);
    setIsConOpenModal(false); 
  }
  const onCancel = () => {
    setRecordToOperate(null);
    setIsConOpenModal(false);
  }

    const onConfirmSave = () => {
    handleSaveRecord(recordToOperate); 
    setRecordToOperate(null);
    setIsConOpenModal(false); 
  }


  // Funcion para eliminar un registro de la base de datos
  const handleDeleteRecord = async (recordId) => {


    // Si es nuevo (temporal), elimínalo directamente del estado
    // Crear un nuevo registro pero finalmente no lo guardas en la base de datos
    if (String(recordId).startsWith('temp')) {
      setEditableRecords(prev => {
        const updatedEditableRecords = prev.filter(r => r.id !== recordId);
        const updatedRecords = records.filter(record => record.id !== recordId);
        setRecords(updatedRecords);
        return updatedEditableRecords;
      });
      // Cerrar modal si es un registro temporal
      setIsOpen(false);
      return;
    }
    // Se lanza la consulta
    try {
      const res = await fetch(`http://localhost:8080/api/timestamp/${recordId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
         },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Error HTTP: ${res.status}`);
      }

      // Eliminar el registro de los estados
      setEditableRecords(prev => prev.filter(r => r.id !== recordId));
      setRecords(prev => prev.filter(r => r.id !== recordId));

      setIsOpen(false);
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(err.message);
    }
  };

  const methods = () => {
    if (action === "save") onConfirmSave()
    if (action === "delete") onConfirmDelete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/80"
        onClick={() => setIsOpen(false)}
      />

      <ConfirmModal isOpen={isConOpen} onConfirm={methods} onCancel={onCancel} message={message} />


      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">Detalles del día</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha:</p>
                <p className="text-base font-semibold">{dayRecords?.day}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total trabajado:</p>
                <p className="text-base font-semibold">{dayRecords?.totalWorked}</p>
              </div>
            </div>

            <h4 className="text-lg font-medium">Turnos:</h4>
            <div className="space-y-3">
              {dayRecords?.periods?.map((period, index) => (
                <div key={index} className={`p-3 rounded-lg ${!period.isComplete ? 'bg-amber-50' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Turno {index + 1}</span>
                    {!period.isComplete && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        Falta salida
                      </span>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div><p className="text-gray-500">Entrada:</p><p>{period.entry}</p></div>
                    <div><p className="text-gray-500">Salida:</p><p>{period.exit || '--'}</p></div>
                    <div><p className="text-gray-500">Duración:</p><p>{period.durationMs > 0 ? `${Math.floor(period.durationMs / 3600000)}h ${Math.floor((period.durationMs % 3600000) / 60000)}m` : '--'}</p></div>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-lg font-medium mt-6">Registros del día:</h4>
            <div className="space-y-2 w-2/4">
              {editableRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <div className="w-full">
                    <div className="text-sm text-gray-500  flex justify-between">
                      <span>Fecha: {record.dateStr}</span>
                      
                      <button
                        onClick={() => onOpenModal(record.id, "delete")}
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300shadow-lg shadow-red-500/50 font-medium rounded-lg text-sm px-2 py-1 text-center me-0 mb-0 cursor-pointer"
                      >X</button>


                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <input
                        type="time"
                        value={record.time}
                        onChange={e => handleTimeChange(index, e.target.value)}
                        className="w-fit px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white  text-gray-900 "
                      />
                      <button
                        onClick={() =>onOpenModal(record.id, "save")}
                        className="w-full sm:w-auto px-4 py-2 rounded-md font-semibold text-sm transition bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer "
                      >Guardar</button>


                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddRecord}
                className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer"
              >
                + Añadir nuevo registro
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

