import { useContext, useState } from 'react';

import { ConfirmModal } from './ConfirmationModal';
import { AuthContext } from '../context/AuthContext';

export const ModalAdd = ({ setIsModalAddOpen, selectedEmployeeId, employees, setRecords, activeTab }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const { auth } = useContext(AuthContext);
  const employee = employees.find(emp => emp.id === selectedEmployeeId);

  const [isConOpen, setIsConOpenModal] = useState(false);
  const [message, setMessage] = useState(null);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const generateTimestamp = (date, time) => {
    if (!date || !time) return null;
    return `${date}T${time}:00.000`;
  };

  const handleCloseModal = () => {
    setIsModalAddOpen(false);
  };

  const handleSubmit = async () => {
    const timestamp = generateTimestamp(date, time);
    if (!timestamp || !selectedEmployeeId) {
      console.error("Faltan datos para enviar el fichaje");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/timestamp/timestamp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmployeeId,
          timestamp,
          isMod: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al guardar el fichaje: ${response.status}`);
      }

      const updatedRecordsResponse = await fetch(
        `http://localhost:8080/api/timestamp/employee/${selectedEmployeeId}/month?year=${activeTab.year}&month=${activeTab.month + 1}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      const updatedRecords = await updatedRecordsResponse.json();
      setRecords(updatedRecords);
      setIsModalAddOpen(false);
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const onOpenModal = () => {
    setMessage("¿Estás seguro de que deseas guardar este registro?");
    setIsConOpenModal(true);
  };

  const onCancel = () => {
    setIsConOpenModal(false);
  };

  const onConfirmSave = () => {
    handleSubmit();
    setIsConOpenModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/80" />

      <ConfirmModal isOpen={isConOpen} onConfirm={onConfirmSave} onCancel={onCancel} message={message} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900 ">Entrada manual de fichaje</h3>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:bg-red-500 hover:text-amber-50 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>

          <div className="p-2 md:p-6 space-y-4 text-gray-800">
            <div className="flex items-center justify-start gap-8">

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Empleado</h2>
              <p className="text-sm text-gray-600">{employee?.name} {employee?.lastName}</p>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Día seleccionado</h2>
              <p className="text-sm text-gray-600">{date || 'No seleccionado'}</p>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Hora</h2>
              <p className="text-sm text-gray-600">{time || 'No seleccionada'}</p>
            </div>
            </div>
            <div className="flex items-center justify-start gap-6">

           
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  onChange={handleDateChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Hora</label>
                <input
                  type="time"
                  onChange={handleTimeChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
               
            </div>
          </div>

          <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
              onClick={onOpenModal}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
