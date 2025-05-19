
import { useContext, useState } from 'react';
import { useEmployees } from '../context/EmployeesContext';
import { Pageable } from './Pageable';
import { AuthContext } from '../context/AuthContext';
import { ConfirmModal } from './ConfirmationModal';

export const UserList = ({ setActiveTab, employeeToDelete, setEmployeeToDelete }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);


    const { employees, loading, fetchEmployees, setEditedEmployee, page, totalPages, setPage, searchTerm,
        setSearchTerm, } = useEmployees();
    const { auth } = useContext(AuthContext);


    const handleSearch = (e) => {
        e.preventDefault();
        fetchEmployees(searchTerm);
    };

    const handleEditHour = (employee, e) => {
        e.preventDefault();
        setEmployeeToDelete(employee);
        setActiveTab("hourly");

    };



    const handleEditClick = (employee, e) => {
        e.preventDefault();
        setEditedEmployee(employee);
        setActiveTab("form");

    };

    const handleDeleteClick = (id) => {
        setEmployeeToDelete(id);
        setIsModalOpen(true);
    };


    const deleteEmployee = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el empleado');
            }

            const isLastItemInPage = employees.length === 1 && page > 0;

            if (isLastItemInPage) {
                setPage(prev => prev - 1);
            } else {
                fetchEmployees();
            }

        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            setIsModalOpen(false);
            setEmployeeToDelete(null);
        }
    };



    if (loading) return <p>Cargando empleados...</p>;

    const onDelete = () => {
        setIsOpen(false);
    }


    const onCancel = () => {
        setIsOpen(false);
    };

    console.log("render desde UserList");

    return (
        <div className="mx-1 mb-4  ">

            {/* Input de búsqueda por Nombre */}
            <form onSubmit={handleSearch} className="flex flex-row gap-4 mb-6"> 
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
                                        onClick={(e) => handleEditHour(employee, e)}
                                        class="relative inline-flex items-center justify-center p-0.5 mb-0 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 cursor-pointer">
                                            <span class="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                                Ver Horario
                                            </span>
                                        </button>
                                     
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={(e) => handleEditClick(employee, e)}

                                            className="rounded-md bg-amber-600 hover:bg-amber-400 px-4 py-1 text-sm font-semibold text-white cursor-pointer"
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


            <ConfirmModal
                isOpen={isModalOpen}
                message="¿Estás seguro de que quieres eliminar este empleado? Esta acción no se puede deshacer y conlleva la eliminacion de todos sus registros."
                onCancel={() => setIsModalOpen(false)}
                onConfirm={() => deleteEmployee(employeeToDelete)}
            />
        </div>
    )
}
