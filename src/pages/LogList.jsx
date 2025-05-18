import { useContext, useEffect, useState } from 'react';
import { formatMillisecondsToTime, processTimeStamps } from '../utilities/timeManagement';
import { Modal } from '../components/Modal';
import { ModalAdd } from '../components/ModalAdd';
import { AuthContext } from '../context/AuthContext';
import { useEmployees } from '../context/EmployeesContext';


export const LogList = () => {

    const { auth } = useContext(AuthContext);

    const [lastRecords, setLastRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLast10Records = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/horarios/last10", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
            });
                if (!response.ok) throw new Error("Error al obtener los datos");

                const data = await response.json();
                setLastRecords(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLast10Records();
    }, []);




    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 mt-16">
            {/* Tabla de últimos registros */}
            <div className='width-full'>

            <h1 className='font-bold mb-4'>Ultimas Notificaciones</h1>
            
            {lastRecords && lastRecords.length > 0 ? (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left">Empleado</th>
                             
                                <th className="py-3 px-4 text-left">Fecha</th>
                             
                                <th className="py-3 px-4 text-left">Hora</th>
                                <th className="py-3 px-4 text-left">Fecha de Notificación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {lastRecords.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 whitespace-nowrap">{record.nombre} {record.apellido} </td>
                                    
                                    <td className="py-3 px-4 whitespace-nowrap">{record.fecha}</td>
                                    
                                    <td className="py-3 px-4 whitespace-nowrap">{record.hora}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(record.enviadoEn).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !isLoading && !error && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No hay registros recientes</p>
                    </div>
                )
            )}

            {error && (
                <div className="text-center py-8 bg-red-50 rounded-lg">
                    <p className="text-red-500">{error}</p>
                </div>
            )}
        </div>
        </div>
        



    );
};
