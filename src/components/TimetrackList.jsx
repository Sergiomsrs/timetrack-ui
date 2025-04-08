import React, { useEffect, useState } from 'react';

export const TimetrackList = () => {
    const [employees, setEmployees] = useState([]);
    const [dailyRecords, setDailyRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar lista de empleados
    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:8081/api/findall')
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => setError(error.message))
            .finally(() => setIsLoading(false));
    }, []);

    // Procesar timestamps incluyendo registros impares
    const processTimeStamps = (timestamps) => {
        const daysMap = new Map();

        // 1. Agrupar registros por día y ordenar por hora
        timestamps.forEach(stamp => {
            const date = new Date(stamp.timestamp);
            const dayKey = date.toLocaleDateString('es-ES');
            
            if (!daysMap.has(dayKey)) {
                daysMap.set(dayKey, []);
            }
            daysMap.get(dayKey).push(date);
        });

        // 2. Procesar cada día
        return Array.from(daysMap.entries()).map(([day, times]) => {
            times.sort((a, b) => a - b); // Ordenar cronológicamente
            
            let totalWorkedMs = 0;
            const periods = [];
            let warning = null;
            
            // 3. Calcular períodos de trabajo
            for (let i = 0; i < times.length; i += 2) {
                const entry = times[i];
                let exit, periodMs;
                
                if (i + 1 < times.length) {
                    // Par completo (entrada-salida)
                    exit = times[i + 1];
                    periodMs = exit - entry;
                    totalWorkedMs += periodMs;
                } else {
                    // Registro impar (falta salida)
                    exit = null;
                    periodMs = 0;
                    warning = "⚠ Falta registro de salida";
                }
                
                periods.push({
                    entry: entry.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                    exit: exit?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                    durationMs: periodMs,
                    isComplete: exit !== null
                });
            }
            
            // 4. Formatear horas totales
            const totalHours = Math.floor(totalWorkedMs / (1000 * 60 * 60));
            const totalMinutes = Math.floor((totalWorkedMs % (1000 * 60 * 60)) / (1000 * 60));
            const totalWorked = totalWorkedMs > 0 ? `${totalHours}h ${totalMinutes}m` : "--";

            return {
                day,
                periods,
                totalWorked,
                recordsCount: times.length,
                warning
            };
        });
    };

    const handleEmployeeSelect = async (e) => {
        const selectedId = e.target.value;
        if (!selectedId) {
            setDailyRecords([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`http://localhost:8081/apis/timestamp/employee/${selectedId}`);
            const data = await response.json();
            setDailyRecords(processTimeStamps(data));
        } catch (error) {
            setError("Error al cargar registros");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-11/12 md:w-3/4 mx-auto p-4">
            {/* Dropdown de empleados */}
            <div className="mb-6">
                <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Empleado
                </label>
                <select
                    id="employee-select"
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
            {dailyRecords.length > 0 ? (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left">Día</th>
                                <th className="py-3 px-4 text-left">Turnos</th>
                                <th className="py-3 px-4 text-center">Horas Totales</th>
                                <th className="py-3 px-4 text-center">Registros</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {dailyRecords.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {record.day}
                                        {record.warning && (
                                            <span className="block text-xs text-yellow-600 mt-1">{record.warning}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {record.periods.map((period, i) => (
                                            <div 
                                                key={i} 
                                                className={`mb-1 last:mb-0 ${!period.isComplete ? 'text-amber-600' : ''}`}
                                            >
                                                <span className="font-medium">{period.entry}</span>
                                                {period.exit ? (
                                                    <>
                                                        → <span className="font-medium"> {period.exit}</span>
                                                        <span className="text-sm text-gray-500 ml-2">
                                                            ({Math.floor(period.durationMs / 3600000)}h {Math.floor((period.durationMs % 3600000) / 60000)}m)
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="ml-2 text-sm">(Falta salida)</span>
                                                )}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4 text-center font-medium">
                                        {record.totalWorked}
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-500">
                                        {record.recordsCount}
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
        </div>
    );
};