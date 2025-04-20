
import { useEmployees } from '../context/EmployeesContext';

export const UserList = ({setActiveTab}) => {

    const { employees, loading } = useEmployees();
    const { refreshEmployees, setEditedEmployee } = useEmployees();
    

    const handleEditClick = (employee, e) => {
        e.preventDefault(); // evita que el botón dentro del form haga un submit
        setEditedEmployee(employee);
        setActiveTab("form"); 
        
    };

    const handleDeleteClick = (employeeId) => {
        // Mostrar el alert de confirmación antes de eliminar
        const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este empleado?');
    
        // Si el usuario confirma, proceder con la eliminación
        if (confirmDelete) {
            fetch(`http://localhost:8080/api/user/${employeeId}`, {
                method: 'DELETE', // Usamos DELETE en lugar de GET
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el empleado');
                }
    
                return response.json(); 
            })
            .then(() => {
                refreshEmployees(); 
            })
            .catch((error) => {
                console.error("Error al eliminar el empleado:", error);
            });
        } else {
            console.log('Eliminación cancelada');
        }
    };


    if (loading) return <p>Cargando empleados...</p>;

    return (
        <div className="mx-1 mb-4 ">
            <form className="space-y-6">

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
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
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
                                        <td className="px-4 py-2">{employee.email}</td>
                                        <td className="px-4 py-2">
                                            <button
                                            onClick={(e) => handleEditClick(employee, e)}

                                                className="rounded-md bg-amber-400 px-2 py-1 text-sm font-semibold text-white"
                                            >Editar</button>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleDeleteClick(employee.id)}
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
