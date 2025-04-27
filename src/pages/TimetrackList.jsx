import React, { useEffect, useState } from 'react';

import { formatMillisecondsToTime, processTimeStamps } from '../utilities/timeManagement';
import { Modal } from '../components/Modal';

export const TimetrackList = () => {


    //Intentar meter el id en los datos procesados para no usar mas estados.

    const [employees, setEmployees] = useState([]); // Guarda los empleados tras recibirlos de la api
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(1); // Id del empleado seleccionado en el dropdown
    const [records, setRecords] = useState([]); // Registros recibidos de la api por id
    const [selectedDayRecords, setSelectedDayRecords] = useState(null); // Registros ya formateados por día. Contiene solo el dia seleccionado
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
     // Registros del dia seleccionado. Se pasa al modal para mostrar los detalles


    // Cargar lista de empleados --> employees
    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:8080/api/user')
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => setError(error.message))
            .finally(() => setIsLoading(false));
    }, []);

    // Actualiza el estado con el id del empleado seleccionado en el dropdown
    useEffect(() => {
        if (selectedEmployeeId) {
            handleEmployeeSelect({ target: { value: selectedEmployeeId } });
        }
    }, []);

    /* Cargar registros de empleados --> records
       selectedEmployeeId
       Si hay empleado seleccionado se cargan los registros de ese empleado tanto formateados (dailyRecords) y sin formatear (records)*/
       // Se dispara con el dropdown
    const handleEmployeeSelect = async (e) => {
        const selectedId = e.target.value;
        setSelectedEmployeeId(selectedId);
        // Si no hay empleado seleccionado, no se cargan registros
        if (!selectedId) {
            setDailyRecords([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        // Si hay empleado seleccionado, se cargan registros
        // Se hace la llamada a la api para obtener los registros del empleado seleccionado

        try {
            const response = await fetch(`http://localhost:8080/api/timestamp/employee/${selectedId}`);
            const data = await response.json();
            setRecords(data);
        } catch (error) {
            setError("Error al cargar registros");
        } finally {
            setIsLoading(false);
        }
    };

    


    /* Abre el modal y asigan a los registros del dia seleccionado (setSelectedDayRecords)
       Se le pasa el objeto completo del dia seleccionado (record) para que el modal lo procese y lo muestre */
    const handleOpenModal = (dayRecords) => {
        setSelectedDayRecords(dayRecords.data?.day);
        setIsOpen(true);
    };

    const processRecord = processTimeStamps(records, selectedEmployeeId)
    console.log("pr",  processRecord)
    


    return (
        <div className="w-11/12 md:w-3/4 mx-auto p-4">
            {/* Dropdown de empleados */}
            <div className="mb-6">
                <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Empleado
                </label>
                <select
                    id="employee-select"
                    value={selectedEmployeeId}
                    
                    onChange={handleEmployeeSelect}
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
            {processRecord && processRecord.length > 0 ? (
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
                            {processRecord.map((record, index) => (
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
                
                setRecords={setRecords}
                selectedDayRecords={selectedDayRecords}
                

                setSelectedDayRecords={setSelectedDayRecords}
                employeeId={selectedEmployeeId}
                records={records}
                dayRecords={selectedDayRecords?.data}
                employees={employees}
            />
        </div>
    );
};