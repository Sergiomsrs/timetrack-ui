import { useContext, useEffect, useState } from 'react';
import { formatMillisecondsToTime, processTimeStamps } from '../utilities/timeManagement';
import { Modal } from './Modal';
import { ModalAdd } from './ModalAdd';
import { AuthContext } from '../context/AuthContext ';


export const TimetrackList = ({
    activeTab,
    isModalAddOpen,
    setIsModalAddOpen,
    fetchRecords,
    fetchEmployees,

    records,
    employees,
    error,
    isLoading,
    selectedEmployeeId,
    selectedDayRecords,

    setRecords,
    setSelectedDayRecords,
    setSelectedEmployeeId
}) => {

    const { auth } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);


    // Cargar lista de empleados al montar el componente
    useEffect(() => {
        if (auth.role == "ADMIN" || auth.role == "GUEST") fetchEmployees();
    }, []);


    // Cargar registros del empleado seleccionado en records
    useEffect(() => {
        fetchRecords(activeTab);
    }, [selectedEmployeeId, activeTab]);



    // Procesar los registros para el renderizado
    const processedRecords = processTimeStamps(records, selectedEmployeeId);

    // Manejar el cambio en el dropdown de empleados
    const handleDropdownChange = (e) => {
        setSelectedEmployeeId(e.target.value);
    };

    // Abrir el modal con los registros de un día seleccionado. Los guarda en selectedDayRecords
    const handleOpenModal = (dayRecords) => {
        setSelectedDayRecords(dayRecords);
        setIsOpen(true);
    };





    return (
        <div className="w-full ">
            {isModalAddOpen &&
                <ModalAdd
                    activeTab={activeTab}
                    isModalAddOpen={isModalAddOpen}
                    setIsModalAddOpen={setIsModalAddOpen}
                    selectedEmployeeId={selectedEmployeeId}
                    employees={employees}
                    setRecords={setRecords} />}

            {/* Dropdown de empleados */}
            {(auth.role == "ADMIN" || auth.role == "GUEST") && <div className="mb-6 w-2/4">
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
            {error && (
                
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            </div>}

            {/* Estado de carga */}
            {isLoading && <div className="text-center py-4 text-blue-500">Cargando registros...</div>}
            
            {/* Mensaje de error */}

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
                                {auth.role == "ADMIN" && <th className="py-3 px-4 text-center"></th>}
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
                                                className={`mb-2 last:mb-0 ${!period.isComplete ? 'text-amber-600' : ''}`}
                                            >
                                                <span className="flex items-center gap-1 text-sm flex-wrap">
                                                    <span className="inline-flex">
                                                        <span
                                                            className={`font-medium px-1 rounded ${period.entryIsMod === "true"
                                                                ? 'border border-red-500 text-red-700'
                                                                : ''
                                                                }`}
                                                        >
                                                            {period.entry}
                                                        </span>
                                                    </span>

                                                    {period.exit ? (
                                                        <>
                                                            <span className="text-gray-500 mx-1 ">→</span>


                                                            <span className="inline-flex">
                                                                <span
                                                                    className={`font-medium px-1 rounded ${period.exitIsMod === "true"
                                                                        ? 'border border-red-500 text-red-700'
                                                                        : ''
                                                                        }`}
                                                                >
                                                                    {period.exit}
                                                                </span>
                                                            </span>

                                                            <span className="text-gray-500 ml-1 whitespace-nowrap">
                                                                ({formatMillisecondsToTime(period.durationMs)})
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-amber-600 font-bold ml-2">(Falta salida)</span>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </td>



                                    <td className="py-3 px-4 text-center font-medium">
                                        {record.data.totalWorked}
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-500">
                                        {record.data.recordsCount}
                                    </td>
                                    {auth.role == "ADMIN" && <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => handleOpenModal(record)}
                                            className="rounded-md cursor-pointer bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                        >
                                            Ver Detalles
                                        </button>
                                    </td>}
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
