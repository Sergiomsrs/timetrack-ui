import React, { useEffect, useState } from 'react'

export const Tabla = () => {
  
 
    const [employees, setEmployees] = useState([]); // Estado para la lista de empleados

    const [workHours, setWorkHours] = useState([]);

    // Cargar todos los empleados cuando el componente se monta
    useEffect(() => {
        fetch('http://localhost:8081/api/findall') // URL para obtener todos los empleados
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => console.error("Error al cargar empleados:", error));
    }, []);

  

  


  return (
    <div className="isolate bg-white px-8 py-24 sm:py-32 lg:px-36">
    <form className="space-y-6">

            {/* Dropdown para seleccionar empleado 
            <div className="flex flex-col gap-4 mb-4">
                <label htmlFor="employee-select" className="text-sm font-medium text-gray-700">Seleccionar Empleado</label>
                <select
                    id="employee-select"
                    onChange={handleEmployeeSelect}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5"
                >
                    <option value="">-- Seleccione un empleado --</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name} {employee.lastName}
                        </option>
                    ))}
                </select>
            </div>

            */}

            {/* Mensaje 
            {message && <p className="text-red-500 text-sm">{message}</p>}

            */}

            {/* Tabla de jornadas */}
            {employees.length > 0 && (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Apellido</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Dni</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{employee.id}</td>
                                    <td className="px-4 py-2">{employee.name || "N/A"}</td>
                                    <td className="px-4 py-2">{employee.lastName || "N/A"}</td>
                                    <td className="px-4 py-2">{employee.dni}</td>
                                    <td className="px-4 py-2">
                                        <button

                                        className="rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white"
                                        >Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

       
        </form>
        </div>
  )
}
