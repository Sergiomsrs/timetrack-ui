import React, { useEffect, useState } from 'react';

import { formatMillisecondsToTime, processTimeStamps } from '../utilities/timeManagement';
import { Modal } from '../components/Modal';
import { ModalAdd } from '../components/ModalAdd';
import { useEmployees } from '../context/EmployeesContext';

export const TimetrackList = ({activeTab, isModalAddOpen, setIsModalAddOpen, bandera, setBandera}) => {
    const [employees, setEmployees] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedDayRecords, setSelectedDayRecords] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);

    
   

    // Cargar lista de empleados al montar el componente
    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/user');
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);



    // Cargar registros del empleado seleccionado en records
    useEffect(() => {
        const fetchRecords = async () => {
            if (!selectedEmployeeId) {
                setRecords([]);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                //const response = await fetch(`http://localhost:8080/api/timestamp/employee/${selectedEmployeeId}`);
                const response = await fetch(`http://localhost:8080/api/timestamp/employee/${selectedEmployeeId}/month?year=${activeTab.year}&month=${activeTab.month + 1}`);
                const data = await response.json();
                setRecords(data);
            } catch (error) {
                setError("Error al cargar registros");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords(selectedEmployeeId, activeTab );
    }, [selectedEmployeeId, activeTab]);

    // Procesar los registros para el renderizado
    const processedRecords = processTimeStamps(records, selectedEmployeeId);
    console.log(processedRecords)

    // Manejar el cambio en el dropdown de empleados
    const handleDropdownChange = (e) => {
        setSelectedEmployeeId(e.target.value);
    };

    // Abrir el modal con los registros de un día seleccionado. Los guarda en selectedDayRecords
    const handleOpenModal = (dayRecords) => {
        setSelectedDayRecords(dayRecords);
        setIsOpen(true);
    };

    const handleOpenModalAdd = () => {
        setIsModalAddOpen(true);
    }


    return (
        <div className="w-full ">
            {isModalAddOpen && 
            <ModalAdd
            key={bandera}
            isModalAddOpen={isModalAddOpen}
            setIsModalAddOpen={setIsModalAddOpen}
            selectedEmployeeId={selectedEmployeeId}
            employees={employees}
            setRecords={setRecords}
            setBandera={setBandera}
            
            
            />}
            {/* Dropdown de empleados */}
            <div className="mb-6 w-2/4">
                <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Empleado
                </label>
                <select
                    id="employee-select"
                    value={selectedEmployeeId}
                    onChange={handleDropdownChange}
                    disabled={isLoading}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">-- Seleccione un empleado --</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name} {employee.lastName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Estado de carga */}
            {isLoading && <div className="text-center py-4 text-blue-500">Cargando registros...</div>}

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Tabla de resultados */}
            {processedRecords && processedRecords.length > 0 ? (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left">Día</th>
                                <th className="py-3 px-4 text-left">Turnos</th>
                                <th className="py-3 px-4 text-center">Horas Totales</th>
                                <th className="py-3 px-4 text-center">Registros</th>
                                <th className="py-3 px-4 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {processedRecords.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {record.data.day}
                                        {record.data.warning && (
                                            <span className="block text-xs text-yellow-600 mt-1">{record.data.warning}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {record.data.periods.map((period, i) => (
                                            <div
                                                key={i}
                                                className={`mb-1 last:mb-0 ${!period.isComplete ? 'text-amber-600' : ''}`}
                                            >
                                                <span className="font-medium">{period.entry}</span>
                                                {period.exit ? (
                                                    <>
                                                        → <span className="font-medium"> {period.exit}</span>
                                                        <span className="text-sm text-gray-500 ml-2">
                                                            ({formatMillisecondsToTime(period.durationMs)})
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="ml-2 text-sm">(Falta salida)</span>
                                                )}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4 text-center font-medium">
                                        {record.data.totalWorked}
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-500">
                                        {record.data.recordsCount}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => handleOpenModal(record)}
                                            className="rounded-md cursor-pointer bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        >
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !isLoading && !error && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                            {employees.length > 0
                                ? "Seleccione un empleado para ver sus registros"
                                : "No hay empleados disponibles"}
                        </p>
                    </div>
                )
            )}

            {/* Modal para mostrar detalles */}
            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                employeeId={selectedEmployeeId}
                selectedDayRecords={selectedDayRecords}
                records={records}
                setRecords={setRecords}
            />
        </div>
    );
};
