
import { useContext } from 'react';
import { useEmployees } from '../context/EmployeesContext';
import { Pageable } from './Pageable';
import { AuthContext } from '../context/AuthContext ';

export const UserList = ({ setActiveTab }) => {

    const { employees, loading, fetchEmployees, setEditedEmployee, page, totalPages, setPage, searchTerm,
        setSearchTerm, } = useEmployees();
    const { auth } = useContext(AuthContext);


    const handleSearch = (e) => {
        e.preventDefault();
        fetchEmployees(searchTerm);
    };



    const handleEditClick = (employee, e) => {
        e.preventDefault();
        setEditedEmployee(employee);
        setActiveTab("form");

    };

    const handleDeleteClick = async (employeeId) => {
        const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este empleado?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/user/${employeeId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el empleado');
            }

            // Verificar si era el último elemento de la página actual
            const isLastItemInPage = employees.length === 1 && page > 0;

            // Si era el último, retroceder de página antes de recargar
            if (isLastItemInPage) {
                setPage(prevPage => prevPage - 1);
            } else {
                fetchEmployees();
            }

        } catch (error) {
            console.error("Error al eliminar el empleado:", error);
        }
    };


    if (loading) return <p>Cargando empleados...</p>;

    return (
        <div className="mx-1 mb-4  ">

            {/* Input de búsqueda por Nombre */}
            <form onSubmit={handleSearch} className="flex flex-row gap-4 mb-6">  {/* ✅ */}
                <div className="w-2/4">
                    <label htmlFor="name-search" className="block text-sm font-medium leading-6 mb-2 text-gray-900">
                        Buscar por Nombre
                    </label>
                    <div className='flex flex-row gap-2 rounded-md font-sm'>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            name="email"
                            id="name-search"
                            className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <button
                            type="submit"
                            className="rounded-md bg-violet-600 hover:bg-violet-500 text-white font-bold px-2 cursor-pointer"
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </form>


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

                                            className="rounded-md bg-amber-600 hover:bg-amber-400 px-2 py-1 text-sm font-semibold text-white cursor-pointer"
                                        >Editar</button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDeleteClick(employee.id)}
                                            className="rounded-md bg-rose-500 hover:bg-rose-600 px-2 py-1 text-sm font-semibold text-white cursor-pointer"
                                        >Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='ml-4'>
                        <Pageable page={page} totalPages={totalPages} setPage={setPage} />
                    </div>


                </div>
            )}



        </div>
    )
}
